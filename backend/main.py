import os
import sys
from pathlib import Path
from typing import Optional, List, Dict, Any
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Determine paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "cleaned_salary_dataset.csv"
MODEL_PATH = BASE_DIR / "backend" / "salary_linear_regression_model.pkl"

app = FastAPI(
    title="HR Salary Analytics & Prediction API",
    description="Backend API serving cleaned HR salary dataset records, statistical analytics, and ML salary predictions.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global data holders
df: Optional[pd.DataFrame] = None
model: Any = None
dataset_stats: Dict[str, Any] = {}
filter_options: Dict[str, Any] = {}

def load_resources():
    global df, model, dataset_stats, filter_options
    print(f"Loading dataset from: {DATA_PATH}")
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset file not found at {DATA_PATH}")
    
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df):,} records successfully.")

    print(f"Loading ML model from: {MODEL_PATH}")
    if MODEL_PATH.exists():
        try:
            model = joblib.load(MODEL_PATH)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    else:
        print("Model file not found.")

    # Compute static filter options
    filter_options = {
        "job_titles": sorted(df["job_title"].dropna().unique().tolist()),
        "education_levels": ["High School", "Diploma", "Bachelor", "Master", "PhD"],
        "industries": sorted(df["industry"].dropna().unique().tolist()),
        "company_sizes": ["Startup", "Small", "Medium", "Large", "Enterprise"],
        "locations": sorted(df["location"].dropna().unique().tolist()),
        "remote_options": ["No", "Hybrid", "Yes"],
        "experience_range": {
            "min": int(df["experience_years"].min()),
            "max": int(df["experience_years"].max())
        },
        "salary_range": {
            "min": int(df["salary"].min()),
            "max": int(df["salary"].max())
        },
        "skills_range": {
            "min": int(df["skills_count"].min()),
            "max": int(df["skills_count"].max())
        },
        "certifications_range": {
            "min": int(df["certifications"].min()),
            "max": int(df["certifications"].max())
        }
    }

    # Precompute global stats
    avg_salary = float(df["salary"].mean())
    median_salary = float(df["salary"].median())
    
    job_means = df.groupby("job_title")["salary"].mean().sort_values(ascending=False)
    loc_means = df.groupby("location")["salary"].mean().sort_values(ascending=False)
    ind_means = df.groupby("industry")["salary"].mean().sort_values(ascending=False)

    remote_counts = df["remote_work"].value_counts(normalize=True).to_dict()

    dataset_stats = {
        "total_records": len(df),
        "avg_salary": round(avg_salary, 2),
        "median_salary": round(median_salary, 2),
        "min_salary": int(df["salary"].min()),
        "max_salary": int(df["salary"].max()),
        "avg_experience": round(float(df["experience_years"].mean()), 1),
        "top_paying_job": {
            "title": job_means.index[0],
            "avg_salary": round(float(job_means.iloc[0]), 2)
        },
        "top_paying_location": {
            "location": loc_means.index[0],
            "avg_salary": round(float(loc_means.iloc[0]), 2)
        },
        "top_paying_industry": {
            "industry": ind_means.index[0],
            "avg_salary": round(float(ind_means.iloc[0]), 2)
        },
        "remote_distribution": {
            k: round(v * 100, 1) for k, v in remote_counts.items()
        }
    }

# Load on startup
@app.on_event("startup")
def startup_event():
    load_resources()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "dataset_loaded": df is not None,
        "total_records": len(df) if df is not None else 0,
        "model_loaded": model is not None
    }

@app.get("/api/meta")
def get_metadata():
    return {
        "filter_options": filter_options,
        "stats": dataset_stats
    }

@app.get("/api/stats")
def get_stats():
    return dataset_stats

@app.get("/api/records")
def get_records(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(15, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Free-text search across job, industry, location"),
    job_title: Optional[str] = Query(None),
    education_level: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    company_size: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    remote_work: Optional[str] = Query(None),
    min_exp: Optional[int] = Query(None),
    max_exp: Optional[int] = Query(None),
    min_salary: Optional[float] = Query(None),
    max_salary: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("salary"),
    sort_order: Optional[str] = Query("desc")
):
    if df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded")

    # Fast boolean mask
    mask = pd.Series(True, index=df.index)

    if search:
        s = search.strip().lower()
        search_mask = (
            df["job_title"].str.lower().str.contains(s, regex=False) |
            df["industry"].str.lower().str.contains(s, regex=False) |
            df["location"].str.lower().str.contains(s, regex=False)
        )
        mask &= search_mask

    if job_title:
        titles = [t.strip() for t in job_title.split(",") if t.strip()]
        if titles:
            mask &= df["job_title"].isin(titles)

    if education_level:
        edus = [e.strip() for e in education_level.split(",") if e.strip()]
        if edus:
            mask &= df["education_level"].isin(edus)

    if industry:
        inds = [i.strip() for i in industry.split(",") if i.strip()]
        if inds:
            mask &= df["industry"].isin(inds)

    if company_size:
        sizes = [sz.strip() for sz in company_size.split(",") if sz.strip()]
        if sizes:
            mask &= df["company_size"].isin(sizes)

    if location:
        locs = [l.strip() for l in location.split(",") if l.strip()]
        if locs:
            mask &= df["location"].isin(locs)

    if remote_work:
        remotes = [r.strip() for r in remote_work.split(",") if r.strip()]
        if remotes:
            mask &= df["remote_work"].isin(remotes)

    if min_exp is not None:
        mask &= (df["experience_years"] >= min_exp)
    if max_exp is not None:
        mask &= (df["experience_years"] <= max_exp)

    if min_salary is not None:
        mask &= (df["salary"] >= min_salary)
    if max_salary is not None:
        mask &= (df["salary"] <= max_salary)

    filtered_df = df[mask]
    total_count = len(filtered_df)

    # Sorting
    valid_sort_cols = [
        "salary", "experience_years", "skills_count", 
        "certifications", "job_title", "education_level", 
        "industry", "company_size", "location"
    ]
    col = sort_by if sort_by in valid_sort_cols else "salary"
    ascending = (sort_order.lower() == "asc")

    sorted_df = filtered_df.sort_values(by=col, ascending=ascending)

    # Pagination
    start = (page - 1) * limit
    end = start + limit
    records_slice = sorted_df.iloc[start:end]

    total_pages = max(1, (total_count + limit - 1) // limit)

    # Summary metrics of the filtered subset
    subset_stats = {
        "filtered_total": total_count,
        "avg_salary": round(float(filtered_df["salary"].mean()), 2) if total_count > 0 else 0,
        "min_salary": int(filtered_df["salary"].min()) if total_count > 0 else 0,
        "max_salary": int(filtered_df["salary"].max()) if total_count > 0 else 0,
    }

    return {
        "page": page,
        "limit": limit,
        "total": total_count,
        "total_pages": total_pages,
        "subset_stats": subset_stats,
        "records": records_slice.to_dict(orient="records")
    }

@app.get("/api/analytics")
def get_analytics():
    if df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded")

    # 1. Salary by Job Title
    job_grouped = df.groupby("job_title")["salary"].agg(
        avg_salary="mean",
        median_salary="median",
        min_salary="min",
        max_salary="max",
        count="count"
    ).reset_index().sort_values(by="avg_salary", ascending=False)
    salary_by_job = [
        {
            "job_title": row["job_title"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "median_salary": round(float(row["median_salary"]), 2),
            "min_salary": int(row["min_salary"]),
            "max_salary": int(row["max_salary"]),
            "count": int(row["count"])
        }
        for _, row in job_grouped.iterrows()
    ]

    # 2. Salary by Experience (0 to 20 years)
    exp_grouped = df.groupby("experience_years")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reset_index().sort_values(by="experience_years")
    salary_by_exp = [
        {
            "experience_years": int(row["experience_years"]),
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in exp_grouped.iterrows()
    ]

    # 3. Salary by Education
    edu_order = ["High School", "Diploma", "Bachelor", "Master", "PhD"]
    edu_grouped = df.groupby("education_level")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reindex(edu_order).reset_index()
    salary_by_edu = [
        {
            "education_level": row["education_level"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in edu_grouped.iterrows()
    ]

    # 4. Salary by Industry
    ind_grouped = df.groupby("industry")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reset_index().sort_values(by="avg_salary", ascending=False)
    salary_by_ind = [
        {
            "industry": row["industry"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in ind_grouped.iterrows()
    ]

    # 5. Salary by Company Size
    size_order = ["Startup", "Small", "Medium", "Large", "Enterprise"]
    size_grouped = df.groupby("company_size")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reindex(size_order).reset_index()
    salary_by_size = [
        {
            "company_size": row["company_size"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in size_grouped.iterrows()
    ]

    # 6. Salary by Remote Work
    remote_grouped = df.groupby("remote_work")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reset_index()
    salary_by_remote = [
        {
            "remote_work": row["remote_work"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in remote_grouped.iterrows()
    ]

    # 7. Salary by Location
    loc_grouped = df.groupby("location")["salary"].agg(
        avg_salary="mean",
        count="count"
    ).reset_index().sort_values(by="avg_salary", ascending=False)
    salary_by_loc = [
        {
            "location": row["location"],
            "avg_salary": round(float(row["avg_salary"]), 2),
            "count": int(row["count"])
        }
        for _, row in loc_grouped.iterrows()
    ]

    # 8. Salary Distribution Bins (12 bins)
    hist, bin_edges = np.histogram(df["salary"], bins=12)
    salary_dist = []
    for i in range(len(hist)):
        low = int(bin_edges[i])
        high = int(bin_edges[i+1])
        salary_dist.append({
            "range_label": f"${low//1000}k-${high//1000}k",
            "low": low,
            "high": high,
            "count": int(hist[i])
        })

    return {
        "salary_by_job": salary_by_job,
        "salary_by_experience": salary_by_exp,
        "salary_by_education": salary_by_edu,
        "salary_by_industry": salary_by_ind,
        "salary_by_company_size": salary_by_size,
        "salary_by_remote": salary_by_remote,
        "salary_by_location": salary_by_loc,
        "salary_distribution": salary_dist
    }

class PredictionRequest(BaseModel):
    job_title: str = Field(..., example="AI Engineer")
    experience_years: float = Field(..., ge=0, le=50, example=5.0)
    education_level: str = Field(..., example="Bachelor")
    skills_count: int = Field(..., ge=1, le=50, example=10)
    industry: str = Field(..., example="Healthcare")
    company_size: str = Field(..., example="Medium")
    location: str = Field(..., example="USA")
    remote_work: str = Field(..., example="Hybrid")
    certifications: int = Field(..., ge=0, le=20, example=2)

@app.post("/api/predict")
def predict_salary(req: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Machine Learning model not loaded")

    # Create input DataFrame
    input_data = pd.DataFrame([{
        "job_title": req.job_title,
        "experience_years": req.experience_years,
        "education_level": req.education_level,
        "skills_count": req.skills_count,
        "industry": req.industry,
        "company_size": req.company_size,
        "location": req.location,
        "remote_work": req.remote_work,
        "certifications": req.certifications
    }])

    try:
        prediction_val = float(model.predict(input_data)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    predicted_salary = max(10000.0, round(prediction_val, 2))

    # Benchmark analytics
    overall_mean = float(df["salary"].mean())
    job_subset = df[df["job_title"] == req.job_title]["salary"]
    job_mean = float(job_subset.mean()) if len(job_subset) > 0 else overall_mean

    # Percentile in full dataset
    percentile = round(float((df["salary"] < predicted_salary).mean()) * 100, 1)

    diff_overall = round(predicted_salary - overall_mean, 2)
    diff_job = round(predicted_salary - job_mean, 2)

    # 10th and 90th percentile of similar jobs
    if len(job_subset) > 0:
        p10 = round(float(job_subset.quantile(0.10)), 2)
        p90 = round(float(job_subset.quantile(0.90)), 2)
    else:
        p10 = round(predicted_salary * 0.85, 2)
        p90 = round(predicted_salary * 1.15, 2)

    return {
        "predicted_salary": predicted_salary,
        "formatted_salary": f"${predicted_salary:,.2f}",
        "percentile": percentile,
        "job_title": req.job_title,
        "job_mean_salary": round(job_mean, 2),
        "overall_mean_salary": round(overall_mean, 2),
        "diff_vs_job_mean": diff_job,
        "diff_vs_overall_mean": diff_overall,
        "benchmark_range": {
            "p10": p10,
            "p90": p90
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

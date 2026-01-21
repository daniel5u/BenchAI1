from pydantic import BaseModel, Field
from typing import List, Optional

class SnapshotItem(BaseModel):
    model: str
    score: float
    publisher: Optional[str] = None
    
class Metrics(BaseModel):
    unit: str
    isBetterHigher: bool = True
    
class Trending(BaseModel):
    views: int = 0
    initialWeight: int = 0
    
class Benchmark(BaseModel):
    name: str
    fullName: str
    publisher: str
    description: str
    link: str
    tags: List[str]
    lastUpdated: str
    metrics: Metrics
    trending: Optional[Trending] = None 
    snapshot: List[SnapshotItem]
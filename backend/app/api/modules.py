from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..core.database import get_db
from ..core.security import get_current_active_user, get_admin_user
from ..models.models import User, DisasterModule, StudentProgress, QuizQuestion
from ..models.schemas import (
    DisasterModule as DisasterModuleSchema,
    DisasterModuleCreate,
    StudentProgress as StudentProgressSchema,
    StudentProgressUpdate,
    QuizQuestion as QuizQuestionSchema,
    DataResponse
)

router = APIRouter()


@router.get("/", response_model=List[DisasterModuleSchema])
def get_all_modules(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all disaster modules."""
    query = db.query(DisasterModule)
    
    if active_only:
        query = query.filter(DisasterModule.is_active == True)
    
    modules = query.offset(skip).limit(limit).all()
    return modules


@router.get("/{module_id}", response_model=DisasterModuleSchema)
def get_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific disaster module."""
    module = db.query(DisasterModule).filter(
        DisasterModule.id == module_id,
        DisasterModule.is_active == True
    ).first()
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    return module


@router.post("/", response_model=DisasterModuleSchema)
def create_module(
    module_data: DisasterModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Create a new disaster module (Admin only)."""
    # Check if module with slug already exists
    existing_module = db.query(DisasterModule).filter(
        DisasterModule.slug == module_data.slug
    ).first()
    
    if existing_module:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Module with this slug already exists"
        )
    
    db_module = DisasterModule(**module_data.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    
    return db_module


@router.get("/{module_id}/questions", response_model=List[QuizQuestionSchema])
def get_module_questions(
    module_id: int,
    phase: Optional[str] = Query(None, regex="^(before|during|after)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get quiz questions for a module."""
    # Verify module exists
    module = db.query(DisasterModule).filter(
        DisasterModule.id == module_id,
        DisasterModule.is_active == True
    ).first()
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    query = db.query(QuizQuestion).filter(QuizQuestion.module_id == module_id)
    
    if phase:
        query = query.filter(QuizQuestion.phase == phase)
    
    questions = query.all()
    return questions


@router.get("/{module_id}/progress", response_model=StudentProgressSchema)
def get_user_module_progress(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's progress for a specific module."""
    progress = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.id,
        StudentProgress.module_id == module_id
    ).first()
    
    if not progress:
        # Create initial progress record
        progress = StudentProgress(
            user_id=current_user.id,
            module_id=module_id,
            completed=False,
            score=0,
            time_spent=0
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return progress


@router.put("/{module_id}/progress", response_model=StudentProgressSchema)
def update_user_module_progress(
    module_id: int,
    progress_data: StudentProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update current user's progress for a specific module."""
    progress = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.id,
        StudentProgress.module_id == module_id
    ).first()
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress record not found"
        )
    
    # Update fields
    for field, value in progress_data.dict(exclude_unset=True).items():
        setattr(progress, field, value)
    
    # Set completed_at timestamp if marking as completed
    if progress_data.completed and not progress.completed:
        from datetime import datetime
        progress.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(progress)
    
    return progress


@router.get("/user/{user_id}/progress", response_model=List[StudentProgressSchema])
def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a user's progress across all modules."""
    # Check if current user can view this data
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    progress = db.query(StudentProgress).filter(
        StudentProgress.user_id == user_id
    ).all()
    
    return progress


@router.delete("/{module_id}", response_model=DataResponse)
def delete_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Soft delete a disaster module (Admin only)."""
    module = db.query(DisasterModule).filter(DisasterModule.id == module_id).first()
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    module.is_active = False
    db.commit()
    
    return {
        "success": True,
        "message": "Module deleted successfully",
        "data": {"module_id": module_id}
    }
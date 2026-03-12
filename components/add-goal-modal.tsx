"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, endDate: string) => void;
}

export function AddGoalModal({ open, onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setEndDate("");
      setTitleError("");
      setDateError("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!endDate) {
      setDateError("A valid end date is required");
      valid = false;
    } else {
      setDateError("");
    }

    if (!valid) return;

    onAdd(title.trim(), endDate);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="What do you want to achieve?"
              aria-describedby={titleError ? "title-error" : undefined}
            />
            {titleError && (
              <p id="title-error" className="text-sm text-red-500">{titleError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal-end-date">End Date</Label>
            <Input
              id="goal-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-describedby={dateError ? "date-error" : undefined}
            />
            {dateError && (
              <p id="date-error" className="text-sm text-red-500">{dateError}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-pastel-lemon text-gray-800 hover:bg-yellow-200">
            Add Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

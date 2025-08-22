"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ProgressLoggerProps {
  goalId: string;
  goalTitle: string;
  unit: string;
  currentProgress: number;
  targetValue: number;
  onProgressLogged?: () => void;
}

export function ProgressLogger({ 
  goalId, 
  goalTitle, 
  unit, 
  currentProgress, 
  targetValue,
  onProgressLogged 
}: ProgressLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const progressValue = parseFloat(value);
    if (isNaN(progressValue) || progressValue <= 0) {
      toast.error('Please enter a valid progress value');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          value: progressValue,
          notes: notes.trim() || undefined,
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Progress logged successfully!');
        setValue('');
        setNotes('');
        setIsOpen(false);
        onProgressLogged?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to log progress');
      }
    } catch (error) {
      console.error('Error logging progress:', error);
      toast.error('Failed to log progress');
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (currentProgress / targetValue) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Log Progress</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Log Progress</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Goal Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-gray-900">{goalTitle}</h4>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Current: {currentProgress} {unit}</span>
              <span>Target: {targetValue} {unit}</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>
          </div>

          {/* Progress Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="progress-value" className="block text-sm font-medium text-gray-700 mb-1">
                Progress Value ({unit})
              </label>
              <Input
                id="progress-value"
                type="number"
                step="0.1"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter progress in ${unit}`}
                required
              />
            </div>

            <div>
              <label htmlFor="progress-notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <Textarea
                id="progress-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about today's progress..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Logging...' : 'Log Progress'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

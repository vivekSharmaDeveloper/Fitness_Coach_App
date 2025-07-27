import { GoalDefinitionForm } from "@/components/goals/GoalDefinitionForm";

export default function DefineSmartGoalPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Define Your SMART Goal</h1>
          <p className="text-gray-500">
            Let's turn your aspirations into actionable goals. A SMART goal is:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Specific:</strong> Clear and well-defined</li>
            <li><strong>Measurable:</strong> Quantifiable and trackable</li>
            <li><strong>Achievable:</strong> Realistic and attainable</li>
            <li><strong>Relevant:</strong> Aligned with your values and long-term objectives</li>
            <li><strong>Time-bound:</strong> Has a clear deadline</li>
          </ul>
        </div>

        <GoalDefinitionForm userId="dev-user" />
      </div>
    </div>
  );
} 
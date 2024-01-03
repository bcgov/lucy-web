ALTER TABLE "blow_by" ADD CONSTRAINT "FK_blow_by_observer_workflow" FOREIGN KEY ("observer_workflow_id") REFERENCES "observer_workflow"("observer_workflow_id") ON DELETE SET NULL;

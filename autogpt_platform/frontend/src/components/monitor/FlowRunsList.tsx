import React from "react";
import { GraphExecutionMeta, LibraryAgent } from "@/lib/autogpt-server-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment/moment";
import { FlowRunStatusBadge } from "@/components/monitor/FlowRunStatusBadge";
import { TextRenderer } from "../ui/render";

export const FlowRunsList: React.FC<{
  flows: LibraryAgent[];
  executions: GraphExecutionMeta[];
  className?: string;
  selectedRun?: GraphExecutionMeta | null;
  onSelectRun: (r: GraphExecutionMeta) => void;
}> = ({ flows, executions, selectedRun, onSelectRun, className }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>Runs</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="flow-runs-list-body">
          {executions.map((execution) => (
            <TableRow
              key={execution.id}
              data-testid={`flow-run-${execution.id}-graph-${execution.graph_id}`}
              data-runid={execution.id}
              data-graphid={execution.graph_id}
              className="cursor-pointer"
              onClick={() => onSelectRun(execution)}
              data-state={selectedRun?.id == execution.id ? "selected" : null}
            >
              <TableCell>
                <TextRenderer
                  value={
                    flows.find((f) => f.graph_id == execution.graph_id)?.name
                  }
                  truncateLengthLimit={30}
                />
              </TableCell>
              <TableCell>
                {moment(execution.started_at).format("HH:mm")}
              </TableCell>
              <TableCell>
                <FlowRunStatusBadge
                  status={execution.status}
                  className="w-full justify-center"
                />
              </TableCell>
              <TableCell>
                {execution.stats
                  ? formatDuration(execution.stats.duration)
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

function formatDuration(seconds: number): string {
  return (
    (seconds < 100 ? seconds.toPrecision(2) : Math.round(seconds)).toString() +
    "s"
  );
}

export default FlowRunsList;

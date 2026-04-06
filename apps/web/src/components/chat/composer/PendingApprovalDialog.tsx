import { memo } from "react";
import { type ApprovalRequestId, type ProviderApprovalDecision } from "@t3tools/contracts";

import { type PendingApproval } from "../../../logic/session";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "../../ui/dialog";
import { ComposerPendingApprovalActions } from "./ComposerPendingApprovalActions";
import { describePendingApproval } from "./pendingApproval";

interface PendingApprovalDialogProps {
  approval: PendingApproval;
  pendingCount: number;
  open: boolean;
  isResponding: boolean;
  onOpenChange: (open: boolean) => void;
  onRespondToApproval: (
    requestId: ApprovalRequestId,
    decision: ProviderApprovalDecision,
  ) => Promise<void>;
}

export const PendingApprovalDialog = memo(function PendingApprovalDialog({
  approval,
  pendingCount,
  open,
  isResponding,
  onOpenChange,
  onRespondToApproval,
}: PendingApprovalDialogProps) {
  const approvalCopy = describePendingApproval(approval);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isResponding) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogPopup className="max-w-2xl" showCloseButton={!isResponding}>
        <DialogHeader>
          <DialogTitle>{approvalCopy.summary}</DialogTitle>
          <DialogDescription>
            {approvalCopy.description}
            {pendingCount > 1 ? ` This is request 1 of ${pendingCount}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="space-y-4">
          {approval.detail ? (
            <div className="rounded-xl border border-border/70 bg-muted/24 p-3">
              <p className="mb-2 font-medium text-sm">Requested action</p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs text-foreground">
                {approval.detail}
              </pre>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Review and approve this request to let the agent continue.
            </p>
          )}
        </DialogPanel>
        <DialogFooter>
          <ComposerPendingApprovalActions
            requestId={approval.requestId}
            isResponding={isResponding}
            onRespondToApproval={onRespondToApproval}
          />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
});

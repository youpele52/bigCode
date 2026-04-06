import { memo, useEffect, useMemo, useState } from "react";
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
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const autoApproveAfterMs = approval.autoApproveAfterMs;
  const requestId = approval.requestId;

  useEffect(() => {
    if (!open || autoApproveAfterMs === undefined) {
      setSecondsRemaining(null);
      return;
    }

    if (!requestId) {
      setSecondsRemaining(null);
      return;
    }

    const deadlineAt = Date.now() + autoApproveAfterMs;
    const updateCountdown = () => {
      const remainingMs = Math.max(0, deadlineAt - Date.now());
      const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setSecondsRemaining(nextSeconds);
      if (remainingMs === 0) {
        onOpenChange(false);
      }
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 250);
    return () => window.clearInterval(interval);
  }, [autoApproveAfterMs, onOpenChange, open, requestId]);

  const autoApproveCopy = useMemo(() => {
    if (autoApproveAfterMs === undefined) {
      return null;
    }
    return `Auto-approves in ${secondsRemaining ?? Math.ceil(autoApproveAfterMs / 1000)}s unless you respond first.`;
  }, [autoApproveAfterMs, secondsRemaining]);

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
          {autoApproveCopy ? (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
              {autoApproveCopy}
            </div>
          ) : null}
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

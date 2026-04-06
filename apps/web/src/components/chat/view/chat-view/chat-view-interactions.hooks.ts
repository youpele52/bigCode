import type { MessageId, ModelSelection, ProviderKind, TurnId } from "@t3tools/contracts";
import { useCallback, useEffect } from "react";

import { type DraftThreadEnvMode } from "~/stores/composer";
import { resolveAppModelSelection, resolveSelectableProvider } from "~/models/provider";
import { proposedPlanTitle } from "~/logic/proposed-plan";
import { stripDiffSearchParams } from "~/utils/diff";

import {
  useAddComposerImages,
  useApplyPromptReplacement,
  usePendingUserInputHandlers,
} from "../ChatView.composerHandlers.logic";
import { useComposerCommandHandlers } from "../ChatView.composerCommandHandlers.logic";
import { useChatKeybindings } from "../ChatView.keybindings.logic";
import { usePlanHandlers } from "../ChatView.planHandlers.logic";
import { useOnSend } from "../ChatView.sendTurn.logic";
import {
  renderProviderTraitsMenuContent,
  renderProviderTraitsPicker,
} from "../../provider/composerProviderRegistry";

import { type ChatViewBaseState } from "./chat-view-base-state.hooks";
import { type ChatViewComposerDerivedState } from "./chat-view-composer-derived.hooks";
import { type ChatViewRuntimeState } from "./chat-view-runtime.hooks";
import { type ChatViewThreadDerivedState } from "./chat-view-thread-derived.hooks";
import { type ChatViewTimelineState } from "./chat-view-timeline.hooks";

interface ChatViewInteractionsInput {
  base: ChatViewBaseState;
  composer: ChatViewComposerDerivedState;
  thread: ChatViewThreadDerivedState;
  timeline: ChatViewTimelineState;
  runtime: ChatViewRuntimeState;
}

export function useChatViewInteractions({
  base,
  composer,
  thread,
  timeline,
  runtime,
}: ChatViewInteractionsInput) {
  const closeExpandedImage = useCallback(() => {
    base.setExpandedImage(null);
  }, [base]);

  const navigateExpandedImage = useCallback(
    (direction: -1 | 1) => {
      base.setExpandedImage((existing) => {
        if (!existing || existing.images.length <= 1) {
          return existing;
        }
        const nextIndex =
          (existing.index + direction + existing.images.length) % existing.images.length;
        return nextIndex === existing.index ? existing : { ...existing, index: nextIndex };
      });
    },
    [base],
  );

  useEffect(() => {
    if (!base.expandedImage) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const expandedImage = base.expandedImage;
      if (!expandedImage) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeExpandedImage();
        return;
      }
      if (expandedImage.images.length <= 1) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        navigateExpandedImage(-1);
        return;
      }
      if (event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      navigateExpandedImage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [base.expandedImage, closeExpandedImage, navigateExpandedImage]);

  const envMode: DraftThreadEnvMode = base.activeThread?.worktreePath
    ? "worktree"
    : base.isLocalDraftThread
      ? (base.draftThread?.envMode ?? "local")
      : "local";

  const onProviderModelSelect = useCallback(
    (provider: ProviderKind, model: string, subProviderID?: string) => {
      if (!base.activeThread) return;
      if (composer.lockedProvider !== null && provider !== composer.lockedProvider) {
        runtime.scheduleComposerFocus();
        return;
      }
      const resolvedProvider = resolveSelectableProvider(composer.providerStatuses, provider);
      const resolvedModel = resolveAppModelSelection(
        resolvedProvider,
        base.settings,
        composer.providerStatuses,
        model,
      );
      const matchedServerModel = composer.modelOptionsByProvider[resolvedProvider]?.find(
        (entry) =>
          entry.slug === resolvedModel &&
          (resolvedProvider !== "opencode" || entry.subProviderID === subProviderID),
      );
      const nextModelSelection: ModelSelection = {
        provider: resolvedProvider,
        model: resolvedModel,
        ...(resolvedProvider === "opencode" && matchedServerModel?.subProviderID
          ? { subProviderID: matchedServerModel.subProviderID }
          : {}),
      };
      base.setComposerDraftModelSelection(base.activeThread.id, nextModelSelection);
      base.setStickyComposerModelSelection(nextModelSelection);
      runtime.scheduleComposerFocus();
    },
    [base, composer, runtime],
  );

  const setPromptFromTraits = useCallback(
    (nextPrompt: string) => {
      const currentPrompt = base.promptRef.current;
      if (nextPrompt === currentPrompt) {
        runtime.scheduleComposerFocus();
        return;
      }
      base.promptRef.current = nextPrompt;
      base.setPrompt(nextPrompt);
      const nextCursor = base.collapseExpandedComposerCursor(nextPrompt, nextPrompt.length);
      base.setComposerCursor(nextCursor);
      base.setComposerTrigger(base.detectComposerTrigger(nextPrompt, nextPrompt.length));
      runtime.scheduleComposerFocus();
    },
    [base, runtime],
  );

  const providerTraitsMenuContent = renderProviderTraitsMenuContent({
    provider: composer.selectedProvider,
    threadId: base.threadId,
    model: composer.selectedModel,
    models: composer.selectedProviderModels,
    modelOptions: composer.composerModelOptions?.[composer.selectedProvider],
    prompt: base.prompt,
    onPromptChange: setPromptFromTraits,
  });

  const providerTraitsPicker = renderProviderTraitsPicker({
    provider: composer.selectedProvider,
    threadId: base.threadId,
    model: composer.selectedModel,
    models: composer.selectedProviderModels,
    modelOptions: composer.composerModelOptions?.[composer.selectedProvider],
    prompt: base.prompt,
    onPromptChange: setPromptFromTraits,
  });

  const applyPromptReplacement = useApplyPromptReplacement({
    promptRef: base.promptRef,
    setPrompt: base.setPrompt,
    setComposerCursor: base.setComposerCursor,
    setComposerTrigger: base.setComposerTrigger,
    activePendingProgress: thread.activePendingProgress,
    activePendingUserInput: thread.activePendingUserInput,
    setPendingUserInputAnswersByRequestId: base.setPendingUserInputAnswersByRequestId,
    composerEditorRef: base.composerEditorRef,
  });

  const pendingUserInputHandlers = usePendingUserInputHandlers({
    activePendingUserInput: thread.activePendingUserInput,
    activePendingProgress: thread.activePendingProgress,
    activePendingResolvedAnswers: thread.activePendingResolvedAnswers,
    promptRef: base.promptRef,
    setComposerCursor: base.setComposerCursor,
    setComposerTrigger: base.setComposerTrigger,
    setPendingUserInputAnswersByRequestId: base.setPendingUserInputAnswersByRequestId,
    setPendingUserInputQuestionIndexByRequestId: base.setPendingUserInputQuestionIndexByRequestId,
    onRespondToUserInput: runtime.turnActions.onRespondToUserInput,
  });

  const planHandlers = usePlanHandlers({
    activeThread: base.activeThread,
    activeProject: base.activeProject,
    activeProposedPlan: thread.activeProposedPlan,
    isServerThread: base.isServerThread,
    isSendBusy: thread.isSendBusy,
    isConnecting: base.isConnecting,
    sendInFlightRef: base.sendInFlightRef,
    planSidebarDismissedForTurnRef: base.planSidebarDismissedForTurnRef,
    planSidebarOpenOnNextThreadRef: base.planSidebarOpenOnNextThreadRef,
    selectedProvider: composer.selectedProvider,
    selectedModel: composer.selectedModel,
    selectedProviderModels: composer.selectedProviderModels,
    selectedPromptEffort: composer.selectedPromptEffort,
    selectedModelSelection: composer.selectedModelSelection,
    runtimeMode: base.runtimeMode,
    shouldAutoScrollRef: runtime.scrollBehavior.shouldAutoScrollRef,
    setOptimisticUserMessages: base.setOptimisticUserMessages,
    setPlanSidebarOpen: base.setPlanSidebarOpen,
    setThreadError: (threadId, error) => runtime.setThreadError(threadId, error),
    setComposerDraftInteractionMode: base.setComposerDraftInteractionMode,
    beginLocalDispatch: thread.beginLocalDispatch,
    resetLocalDispatch: thread.resetLocalDispatch,
    forceStickToBottom: runtime.scrollBehavior.forceStickToBottom,
    persistThreadSettingsForNextTurn: runtime.persistThreadSettingsForNextTurn,
  });

  const onSend = useOnSend({
    activeThread: base.activeThread,
    activeProject: base.activeProject,
    activeThreadId: base.activeThreadId,
    isServerThread: base.isServerThread,
    isLocalDraftThread: base.isLocalDraftThread,
    isSendBusy: thread.isSendBusy,
    isConnecting: base.isConnecting,
    sendInFlightRef: base.sendInFlightRef,
    promptRef: base.promptRef,
    composerImages: base.composerImages,
    composerImagesRef: base.composerImagesRef,
    composerTerminalContexts: base.composerTerminalContexts,
    composerTerminalContextsRef: base.composerTerminalContextsRef,
    selectedProvider: composer.selectedProvider,
    selectedModel: composer.selectedModel,
    selectedProviderModels: composer.selectedProviderModels,
    selectedPromptEffort: composer.selectedPromptEffort,
    selectedModelSelection: composer.selectedModelSelection,
    runtimeMode: base.runtimeMode,
    interactionMode: base.interactionMode,
    envMode,
    showPlanFollowUpPrompt: thread.showPlanFollowUpPrompt,
    activeProposedPlan: thread.activeProposedPlan,
    activePendingProgress: thread.activePendingProgress,
    shouldAutoScrollRef: runtime.scrollBehavior.shouldAutoScrollRef,
    setOptimisticUserMessages: base.setOptimisticUserMessages,
    setPrompt: base.setPrompt,
    setComposerCursor: base.setComposerCursor,
    setComposerTrigger: base.setComposerTrigger,
    setComposerHighlightedItemId: base.setComposerHighlightedItemId,
    setThreadError: runtime.setThreadError,
    setStoreThreadError: base.setStoreThreadError,
    addComposerImagesToDraft: base.addComposerImagesToDraft,
    addComposerTerminalContextsToDraft: base.addComposerTerminalContextsToDraft,
    clearComposerDraftContent: base.clearComposerDraftContent,
    beginLocalDispatch: thread.beginLocalDispatch,
    resetLocalDispatch: thread.resetLocalDispatch,
    forceStickToBottom: runtime.scrollBehavior.forceStickToBottom,
    persistThreadSettingsForNextTurn: runtime.persistThreadSettingsForNextTurn,
    onSubmitPlanFollowUp: planHandlers.onSubmitPlanFollowUp,
    handleInteractionModeChange: runtime.handleInteractionModeChange,
    onAdvanceActivePendingUserInput: pendingUserInputHandlers.onAdvanceActivePendingUserInput,
  });

  const addComposerImages = useAddComposerImages({
    activeThreadId: base.activeThreadId,
    composerImagesRef: base.composerImagesRef,
    pendingUserInputsLength: thread.pendingUserInputs.length,
    addComposerImage: base.addComposerImage,
    addComposerImagesToDraft: base.addComposerImagesToDraft,
    setThreadError: runtime.setThreadError,
  });

  const onComposerPaste = useCallback(
    (event: React.ClipboardEvent<HTMLElement>) => {
      const imageFiles = Array.from(event.clipboardData.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (imageFiles.length === 0) return;
      event.preventDefault();
      addComposerImages(imageFiles);
    },
    [addComposerImages],
  );

  const onComposerDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      base.dragDepthRef.current += 1;
      base.setIsDragOverComposer(true);
    },
    [base],
  );

  const onComposerDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      base.setIsDragOverComposer(true);
    },
    [base],
  );

  const onComposerDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
      base.dragDepthRef.current = Math.max(0, base.dragDepthRef.current - 1);
      if (base.dragDepthRef.current === 0) {
        base.setIsDragOverComposer(false);
      }
    },
    [base],
  );

  const onComposerDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      base.dragDepthRef.current = 0;
      base.setIsDragOverComposer(false);
      addComposerImages(Array.from(event.dataTransfer.files));
      runtime.focusComposer();
    },
    [addComposerImages, base, runtime],
  );

  const composerCommandHandlers = useComposerCommandHandlers({
    composerMenuOpenRef: base.composerMenuOpenRef,
    composerMenuItemsRef: base.composerMenuItemsRef,
    activeComposerMenuItemRef: base.activeComposerMenuItemRef,
    composerSelectLockRef: base.composerSelectLockRef,
    composerEditorRef: base.composerEditorRef,
    promptRef: base.promptRef,
    composerCursor: base.composerCursor,
    composerTerminalContexts: base.composerTerminalContexts,
    composerMenuItems: composer.composerMenuItems,
    composerHighlightedItemId: base.composerHighlightedItemId,
    interactionMode: base.interactionMode,
    activePendingProgress: thread.activePendingProgress,
    activePendingUserInput: thread.activePendingUserInput,
    setComposerCursor: base.setComposerCursor,
    setComposerTrigger: base.setComposerTrigger,
    setComposerHighlightedItemId: base.setComposerHighlightedItemId,
    setComposerDraftTerminalContexts: base.setComposerDraftTerminalContexts,
    threadId: base.threadId,
    setPrompt: base.setPrompt,
    setPendingUserInputAnswersByRequestId: base.setPendingUserInputAnswersByRequestId,
    applyPromptReplacement,
    onProviderModelSelect,
    handleInteractionModeChange: runtime.handleInteractionModeChange,
    toggleInteractionMode: runtime.toggleInteractionMode,
    onSend,
    onChangeActivePendingUserInputCustomAnswer:
      pendingUserInputHandlers.onChangeActivePendingUserInputCustomAnswer,
  });

  useChatKeybindings({
    activeThreadId: base.activeThreadId,
    activeProject: base.activeProject,
    terminalState: base.terminalState,
    keybindings: composer.keybindings,
    toggleTerminalVisibility: runtime.terminalActions.toggleTerminalVisibility,
    setTerminalOpen: runtime.terminalActions.setTerminalOpen,
    splitTerminal: runtime.terminalActions.splitTerminal,
    closeTerminal: runtime.terminalActions.closeTerminal,
    createNewTerminal: runtime.terminalActions.createNewTerminal,
    onToggleDiff: runtime.onToggleDiff,
    runProjectScript: runtime.terminalActions.runProjectScript,
  });

  const isComposerMenuLoading =
    composer.composerTriggerKind === "path" &&
    ((composer.pathTriggerQuery.length > 0 &&
      composer.composerPathQueryDebouncer.state.isPending) ||
      composer.workspaceEntriesQuery.isLoading ||
      composer.workspaceEntriesQuery.isFetching);

  const pendingAction = thread.activePendingProgress
    ? {
        questionIndex: thread.activePendingProgress.questionIndex,
        isLastQuestion: thread.activePendingProgress.isLastQuestion,
        canAdvance: thread.activePendingProgress.canAdvance,
        isResponding: runtime.activePendingIsResponding,
        isComplete: Boolean(thread.activePendingResolvedAnswers),
      }
    : null;

  const onOpenTurnDiff = useCallback(
    (turnId: TurnId, filePath?: string) => {
      void base.navigate({
        to: "/$threadId",
        params: { threadId: base.threadId },
        search: (previous) => {
          const rest = stripDiffSearchParams(previous);
          return filePath
            ? { ...rest, diff: "1", diffTurnId: turnId, diffFilePath: filePath }
            : { ...rest, diff: "1", diffTurnId: turnId };
        },
      });
    },
    [base],
  );

  const onToggleWorkGroup = useCallback(
    (groupId: string) => {
      base.setExpandedWorkGroups((existing) => ({
        ...existing,
        [groupId]: !existing[groupId],
      }));
    },
    [base],
  );

  const onRevertUserMessage = useCallback(
    (messageId: MessageId) => {
      const targetTurnCount = timeline.revertTurnCountByUserMessageId.get(messageId);
      if (typeof targetTurnCount !== "number") return;
      void runtime.turnActions.onRevertToTurnCount(targetTurnCount);
    },
    [runtime.turnActions, timeline.revertTurnCountByUserMessageId],
  );

  return {
    envMode,
    providerTraitsMenuContent,
    providerTraitsPicker,
    planHandlers,
    pendingUserInputHandlers,
    composerCommandHandlers,
    onSend,
    onProviderModelSelect,
    onComposerPaste,
    onComposerDragEnter,
    onComposerDragOver,
    onComposerDragLeave,
    onComposerDrop,
    isComposerMenuLoading,
    pendingAction,
    closeExpandedImage,
    navigateExpandedImage,
    onOpenTurnDiff,
    onToggleWorkGroup,
    onRevertUserMessage,
    onEnvModeChange: (mode: DraftThreadEnvMode) => {
      if (base.isLocalDraftThread) {
        base.setDraftThreadContext(base.threadId, { envMode: mode });
      }
      runtime.scheduleComposerFocus();
    },
    expandedImageItem: base.expandedImage
      ? base.expandedImage.images[base.expandedImage.index]
      : null,
    activeProjectName: base.activeProject?.name,
    preferredScriptId: base.activeProject
      ? (base.lastInvokedScriptByProjectId[base.activeProject.id] ?? null)
      : null,
    activeTurnInProgress: thread.isWorking || !thread.latestTurnSettled,
    planTitle: thread.activeProposedPlan
      ? (proposedPlanTitle(thread.activeProposedPlan.planMarkdown) ?? null)
      : null,
  };
}

export type ChatViewInteractionsState = ReturnType<typeof useChatViewInteractions>;

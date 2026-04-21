import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Share, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  // iOS Safari
  (navigator as any).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

interface Props {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

const InstallAppButton = ({
  variant = "default",
  size = "default",
  className,
  label = "Install app",
}: Props) => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  // Inside Lovable preview iframe, install events are blocked. Hide quietly.
  if (isInIframe()) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      return;
    }
    // Fallback: iOS Safari or browsers without prompt support
    setShowIos(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        aria-label={label}
      >
        <Download className="h-4 w-4" />
        <span className="ml-2">{label}</span>
      </Button>

      <Dialog open={showIos} onOpenChange={setShowIos}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Install U.Psy on your device
            </DialogTitle>
            <DialogDescription>
              Add U.Psy to your home screen for a full-app experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            {isIOS() ? (
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  <span>Tap the <Share className="inline h-4 w-4 mx-1" /> <strong>Share</strong> button in Safari's toolbar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  <span>Scroll and tap <Plus className="inline h-4 w-4 mx-1" /> <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  <span>Tap <strong>Add</strong> in the top right corner.</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  <span>Open the browser menu (⋮ or ⋯).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  <span>Tap <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                  <span>Confirm to add U.Psy to your device.</span>
                </li>
              </ol>
            )}

            <p className="text-xs text-muted-foreground border-t pt-3">
              Tip: U.Psy works best when installed — push notifications, faster loading, and full-screen experience.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallAppButton;
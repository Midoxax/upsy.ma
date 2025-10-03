import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApprovalModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  applicantEmail: string;
  applicantName: string;
}

const ApprovalModal = ({ open, onClose, onConfirm, applicantEmail, applicantName }: ApprovalModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Application</AlertDialogTitle>
          <AlertDialogDescription>
            This will create an account for <strong>{applicantName}</strong> ({applicantEmail}) and send them a welcome
            email with login credentials.
            <br />
            <br />
            Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Approve & Send Email</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApprovalModal;

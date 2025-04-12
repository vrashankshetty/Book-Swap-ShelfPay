import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  


export default function DialogLoginScreen({
    isDialogOpen,
    setIsDialogOpen,
    onSubmit,
    }: {
    isDialogOpen: boolean
    setIsDialogOpen: (isOpen: boolean) => void
    onSubmit: () => void
}) {
  return (
    <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>You need to be logged in to rent or exchange books.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={onSubmit}>
                Continue to Login
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

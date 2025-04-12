import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  


export default function DialogRentScreen({
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
          <DialogContent className="sm:max-w-md flex justify-center flex-col items-center gap-5">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Pay Now</DialogTitle>
              <DialogDescription>Are you sure you want to proceed?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={onSubmit}>
                Continue
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

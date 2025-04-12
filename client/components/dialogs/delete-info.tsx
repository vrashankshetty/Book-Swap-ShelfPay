import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  


export default function DialogDeleteScreen({
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
              <DialogTitle>Delete</DialogTitle>
              <DialogDescription>Are you sure you want to delete?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={onSubmit} variant="destructive">
                Yes
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                No
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

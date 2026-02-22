import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [open])

  function handleClose() {
    setIsVisible(false)
    setTimeout(onClose, 250)
  }

  return (
    <Transition show={open && isVisible} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-40">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="w-full md:max-w-xl mx-auto bg-surface rounded-t-2xl shadow-xl px-6 pt-6 pb-10">
              <div className="flex justify-center mb-8">
                <div className="w-10 h-1 rounded-full bg-on-surface/20" />
              </div>
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

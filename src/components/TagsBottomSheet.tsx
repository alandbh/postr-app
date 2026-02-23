import React, { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import TagModal from "@/components/TagModal";
import Button from "./Button";

interface TagsBottomSheetProps {
  articleId: string;
  articleTitle: string;
  onClose: () => void;
}

export default function TagsBottomSheet({
  articleId,
  articleTitle,
  onClose,
}: TagsBottomSheetProps) {
  const [showTagModal, setShowTagModal] = useState(false);

  function handleAddTags() {
    setShowTagModal(true);
  }

  function handleTagModalClose() {
    setShowTagModal(false);
    onClose();
  }

  return (
    <>
      <BottomSheet open={!showTagModal} onClose={onClose}>
        <h2 className="text-xl font-bold text-on-surface mb-3 w-full">
          Adicione tags (etiquetas) a{" "}
          <span className="text-nowrap">este artigo.</span>
        </h2>
        <p className="md:text-base text-on-surface/60 mb-10">
          Assim fica mais fácil encontrá-lo{" "}
          <span className="text-nowrap">depois. 😎</span>
        </p>

        {/* <button
          onClick={handleAddTags}
          className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:opacity-90 transition-opacity mb-3"
        >
          Adicionar tags
        </button> */}
        <div className="flex flex-col gap-4">
          <Button variant="primary" full onClick={handleAddTags}>
            Adicionar tags
          </Button>

          <Button variant="ghost" full onClick={onClose}>
            Não, obrigado
          </Button>
        </div>
      </BottomSheet>

      {showTagModal && (
        <TagModal
          articleId={articleId}
          articleTitle={articleTitle}
          onClose={handleTagModalClose}
        />
      )}
    </>
  );
}

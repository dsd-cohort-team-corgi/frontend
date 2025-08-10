import React from "react";
import type { PressEvent } from "@react-types/shared";
import { Image, Mic } from "lucide-react";
import { useDropzone } from "react-dropzone";
import StyledAsButton from "../StyledAsButton";
import LoadingMessage from "../icons/LoadingMessage";

type MicUiType = {
  aiThinking: boolean;
  isListening: boolean;
  toggleListening: (e: PressEvent) => void;
  showImageDropzone: boolean;
  onImageUpload?: (file: File) => void;
};

export default function MicUi({
  aiThinking,
  isListening,
  toggleListening,
  showImageDropzone,
  onImageUpload,
}: MicUiType) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && onImageUpload) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
    disabled: !showImageDropzone || isListening || aiThinking,
  });

  const handleButtonClick = (e: PressEvent) => {
    toggleListening(e);
  };

  const getHelperText = () => {
    if (!showImageDropzone) {
      return "Tap to speak";
    }

    if (isDragActive) {
      return "Drop image here...";
    }

    if (aiThinking) {
      return "Uploading image...";
    }

    return "Tap to speak or upload image";
  };

  const getButtonClassName = () => {
    if (isListening) {
      return "bg-gray-900 text-white animate-pulse";
    }

    if (isDragActive) {
      return "bg-blue-100 text-blue-600 border-2 border-blue-300";
    }

    return "bg-white text-black";
  };

  const getContainerClassName = () => {
    const baseClass =
      "w-full transition-all duration-200 flex flex-col items-center justify-center";

    if (isDragActive) {
      return `${baseClass} border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50`;
    }

    return baseClass;
  };

  const getButtonIcon = () => {
    if (isDragActive) {
      return <Image size={18} />;
    }
    return <Mic size={18} />;
  };

  const helperText = getHelperText();

  return (
    <div
      className={getContainerClassName()}
      onDragEnter={showImageDropzone ? getRootProps().onDragEnter : undefined}
      onDragLeave={showImageDropzone ? getRootProps().onDragLeave : undefined}
      onDragOver={showImageDropzone ? getRootProps().onDragOver : undefined}
      onDrop={showImageDropzone ? getRootProps().onDrop : undefined}
    >
      {showImageDropzone && (
        <input
          accept="image/*"
          multiple={false}
          onChange={getInputProps().onChange}
          onClick={getInputProps().onClick}
          onDragEnter={getInputProps().onDragEnter}
          onDragLeave={getInputProps().onDragLeave}
          onDragOver={getInputProps().onDragOver}
          onDrop={getInputProps().onDrop}
          style={{ display: "none" }}
          alt=""
        />
      )}

      {aiThinking && <LoadingMessage text="Hmm, let me think" />}
      {!aiThinking && isListening && (
        <span className="block text-gray-400 text-sm mb-4 mt-4">
          I&apos;m listening...
        </span>
      )}

      {!aiThinking && (
        <StyledAsButton
          className={`rounded-full p-5 transition-colors ${getButtonClassName()}`}
          onPress={handleButtonClick}
          startContent={getButtonIcon()}
        />
      )}
      {!aiThinking && !isListening && (
        <span className="block text-gray-400 text-sm mt-4">{helperText}</span>
      )}
    </div>
  );
}

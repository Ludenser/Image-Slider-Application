import React, {
    MutableRefObject,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Mods, classNames } from "../../lib/classNames";
import { Portal } from "../Portal/Portal";
import cls from "./ImageModal.module.scss";

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  lazy?: boolean;
  backgroundImageUrl?: string;
  closeOnClick?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal = (props: ModalProps) => {
  const {
    className,
    children,
    isOpen,
    onClose,
    lazy,
    backgroundImageUrl,
    closeOnClick = false,
  } = props;

  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const clickStartedInside = useRef(false);
  const timerRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const closeHandler = useCallback(() => {
    if (onClose) {
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        onClose();
        setIsOpening(false);
        setIsClosing(false);
      }, ANIMATION_DELAY);
    }
  }, [onClose]);

  const cancelCloseAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      setIsClosing(false);
    }
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeHandler();
      }
    },
    [closeHandler]
  );

  const handleOverlayMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnClick || e.target === e.currentTarget && !clickStartedInside.current) {
        closeHandler();
      }
      clickStartedInside.current = false;
    },
    [closeHandler, closeOnClick]
  );

  const handleContentMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      cancelCloseAnimation();
      clickStartedInside.current = true;
    },
    [cancelCloseAnimation]
  );

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
      timerRef.current = setTimeout(() => {
        setIsOpening(true);
      }, 30);
    }
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  const mods: Mods = {
    [cls.opened]: isOpen,
    [cls.isOpening]: isOpening,
    [cls.isClosing]: isClosing,
  };

  if (lazy && !isMounted) {
    return null;
  }

  return (
    <Portal>
      <div className={classNames(cls.Modal, mods, [className])}>
        {backgroundImageUrl && (
          <style>
            {`.${cls.content}::before { background-image: url(${backgroundImageUrl}); }`}
          </style>
        )}
        <div className={cls.overlay} onMouseUp={handleOverlayMouseUp}>
          <div
            className={cls.content}
            onClick={onContentClick}
            onMouseDown={handleContentMouseDown}
            style={{
              backgroundImage: backgroundImageUrl
                ? `url(${backgroundImageUrl})`
                : "none",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

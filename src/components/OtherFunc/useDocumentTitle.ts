// useDocumentTitle.js
import { useEffect, useRef } from 'react';

function useDocumentTitle(title:string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title+' - Hà Bắc Media Club';
  }, [title]);

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = defaultTitle.current;
    }
  }, [prevailOnUnmount])
}

export default useDocumentTitle
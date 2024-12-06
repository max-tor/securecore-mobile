import {useEffect, useRef, useState} from 'react';
import {useFocusedTab} from 'react-native-collapsible-tab-view';

export const useIsTabFocused = (tabName: string): boolean => {
  const [isTabFocused, setIsTabFocued] = useState<boolean>(false);
  const prevTabRef = useRef<string | null>(null);
  const currentFocusedTab = useFocusedTab();

  useEffect(() => {
    if (
      prevTabRef.current &&
      prevTabRef.current !== tabName &&
      currentFocusedTab === tabName
    ) {
      setIsTabFocued(true);
    } else {
      setIsTabFocued(false);
    }
    prevTabRef.current = currentFocusedTab;
  }, [currentFocusedTab, tabName]);

  return isTabFocused;
};

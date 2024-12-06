import {Button, ITextAreaProps, Text} from 'native-base';
import React, {LegacyRef, useCallback, useRef, useState} from 'react';
import {Modal, SafeAreaView, TouchableOpacity} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

import {HtmlView, TextArea} from '@/components';
import {
  HeaderItemIconBack,
  HeaderItemNavbar,
  HeaderItemTitle,
} from '@/components/common/Header/styles';
import {HtmlTextAreaView} from '@/components/common/HtmlTextArea/styles';
import {IconTypes} from '@/components/common/Icon';
import {OverlayContainer} from '@/components/common/OverlayContainer';

interface HtmlTextAreaProps extends ITextAreaProps {
  editorTitle: string;
  mode: 'edit' | 'add';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any;
  [p: string]: unknown;
}

const handleHead = ({tintColor}: {tintColor: string}) => (
  <Text style={{color: tintColor}}>H1</Text>
);

export const HtmlTextArea: React.FC<HtmlTextAreaProps> = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({editorTitle, mode, onChangeText, ...textAreaProps}, ref: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState<string>('false');
    const editorRef = useRef();
    const onActivateEditor = useCallback(() => {
      setModalVisible(true);
    }, []);

    const onBack = useCallback(() => {
      setModalVisible(false);
    }, []);

    const onSave = useCallback(() => {
      onChangeText?.(content);
      onBack();
    }, [content, onBack, onChangeText]);

    const onChange = useCallback((value: string) => {
      setContent(value);
    }, []);

    const renderModal = () => (
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={onBack}>
        <SafeAreaView style={{flex: 1}}>
          <HeaderItemNavbar>
            <HeaderItemIconBack
              name={IconTypes.Back}
              size={25}
              color="#000"
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <OverlayContainer>
              <HeaderItemTitle numberOfLines={1} ellipsizeMode="tail">
                {editorTitle}
              </HeaderItemTitle>
            </OverlayContainer>
            <Button size="xs" onPress={onSave}>
              Save
            </Button>
          </HeaderItemNavbar>
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.setUnderline,
              actions.undo,
              actions.redo,
            ]}
            iconMap={{[actions.heading1]: handleHead}}
          />
          <RichEditor
            scrollEnabled
            style={{flex: 1}}
            ref={editorRef as unknown as LegacyRef<RichEditor> | undefined}
            initialContentHTML={textAreaProps.value}
            onChange={onChange}
          />
        </SafeAreaView>
      </Modal>
    );

    if (modalVisible) {
      return renderModal();
    }

    if (mode === 'add') {
      return (
        <TextArea
          name="rich-editior"
          onFocus={onActivateEditor}
          autoCompleteType={false}
          {...textAreaProps}
          ref={ref}
        />
      );
    }

    return (
      <HtmlTextAreaView scrollEnabled>
        <TouchableOpacity onPress={onActivateEditor}>
          <HtmlView
            contentHtml={textAreaProps.value || ''}
            baseStyle={{paddingTop: 10}}
          />
        </TouchableOpacity>
      </HtmlTextAreaView>
    );
  },
);

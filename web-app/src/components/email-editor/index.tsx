import EmailEditor from 'react-email-editor';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const EmailEditorComponent = (props: any) => {
  const { trigger_id, bodyDesign } = props;

  const dispatch = useDispatch();

  const emailEditorRef = useRef(null);

  const onReady = () => {
    // editor is ready
    console.log('onReady');
    // @ts-ignore
    emailEditorRef?.current?.editor?.addEventListener(
      'design:updated',
      function (updates: any) {
        // @ts-ignore
        emailEditorRef?.current?.editor?.exportHtml(function (data: any) {
          dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
            email_template_id: trigger_id,
            key: 'body_html',
            value: data.html
          });
          dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
            email_template_id: trigger_id,
            key: 'body_design',
            value: data.design
          });
        });
      }
    );
  };

  const onLoad = () => {
    //@ts-ignore
    const design = bodyDesign;
    if (Object.keys(design).length > 0) {
      const intervalId = setInterval(() => {
        if (emailEditorRef.current) {
          // @ts-ignore
          emailEditorRef.current.editor.loadDesign(design);
          clearInterval(intervalId);
        }
      }, 1000);
    }
  };

  return (
    <EmailEditor
      onReady={onReady}
      onLoad={onLoad}
      ref={emailEditorRef}
      tools={{
        image: {
          enabled: false
        }
      }}
      {...props}
    />
  );
};

EmailEditorComponent.propTypes = {
  projectId: PropTypes.number,
  setBodyHtml: PropTypes.func,
  setBodyDesign: PropTypes.func,
  trigger_id: PropTypes.string,
  bodyDesign: PropTypes.object,
  style: PropTypes.object,
  options: PropTypes.object
};

export default EmailEditorComponent;

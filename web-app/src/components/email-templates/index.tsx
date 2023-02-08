import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PreviewEmailTemplate from '../modals/PreviewEmailTemplate';
import design from './Style.module.scss';
import Spinner from '../library/spinner/spinner';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const EmailTemplates = (props: any) => {
  const { triggerId } = props;
  const [activeTab, setActiveTab] = useState<number>(1);
  const changeTab = (idx: number) => {
    setActiveTab(idx + 1);
  };
  const router = useRouter();

  const dispatch = useDispatch();
  const defaultTemplates = useSelector(
    (state: RootState) => state.email_templates.default
  );
  const userCreatedTemplates = useSelector(
    (state: RootState) => state.email_templates.user
  );
  const templatesLoading = useSelector(
    (state: RootState) => state.email_templates.loading
  );

  useEffect(() => {
    if (
      Object.keys(defaultTemplates).length === 0 ||
      Object.keys(userCreatedTemplates).length === 0
    )
      dispatch.email_templates.LOAD_TEMPLATES();
  }, []);

  const tabs = ['Popular Templates', 'Your Templates'];
  const [previewTemplate, setPreviewTemplate] = useState<any>({
    body_html: ''
  });
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const closeModal = () => {
    setOpenPreview(false);
  };
  const openModal = (templateData: any) => {
    setPreviewTemplate(templateData);
    setOpenPreview(true);
  };

  const handleUseTemplate = (templateData: any) => {
    dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
      email_template_id: triggerId,
      key: 'body_html',
      value: templateData.body_html
    });

    dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
      email_template_id: triggerId,
      key: 'body_design',
      value: templateData.body_design
    });

    router.push(`/email-editor/${triggerId}`);
  };

  useEffect(() => {
    console.log('default templates: ', defaultTemplates);
    console.log('user created templates: ', userCreatedTemplates);
  }, [defaultTemplates]);

  return (
    <>
      <PreviewEmailTemplate
        open={openPreview}
        closeModal={closeModal}
        templateData={previewTemplate}
        handleUseTemplate={handleUseTemplate}
      />
      <div className="flex h-full w-full flex-grow flex-col pt-2">
        <div className="mx-auto my-3 flex items-center">
          <div className="flex items-center justify-center rounded border-2 border-blue p-[2px]">
            {tabs.map((content: any, index: number) => (
              <button
                key={index}
                onClick={() => changeTab(index)}
                className={`h-14 w-80 rounded text-xl font-semibold text-black ${
                  activeTab == index + 1 && 'bg-blue text-honeydew'
                }`}
              >
                {content}
              </button>
            ))}
          </div>
        </div>
        {activeTab === 1 && (
          <div
            className="w-full px-2 py-4"
            style={{ height: 'calc(100% - 9rem)' }}
          >
            <div className="h-full w-full overflow-y-auto">
              {templatesLoading ? (
                <div className="fixed flex h-screen w-full items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-wrap justify-center">
                  {Object.keys(defaultTemplates).map((key: string) => (
                    <div
                      className={design.grid_element_default}
                      style={{
                        backgroundImage: `url(${defaultTemplates[key].body_image})`
                      }}
                    >
                      <div className={design.grid_overlay}>
                        <div className="flex flex-col">
                          <button
                            className={design.grid_overlay_preview}
                            onClick={() => openModal(defaultTemplates[key])}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() =>
                              handleUseTemplate(defaultTemplates[key])
                            }
                            className={design.grid_overlay_use_template}
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div
            className="w-full px-2 py-4"
            style={{ height: 'calc(100% - 9rem)' }}
          >
            <div className="h-full w-full overflow-y-auto">
              {templatesLoading ? (
                <div className="fixed flex h-screen w-full items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-wrap justify-center">
                  {Object.keys(userCreatedTemplates).map((key: string) => (
                    <div className={design.grid_element_default}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: userCreatedTemplates[key].body_html
                        }}
                        className={design.grid_content}
                      ></div>
                      <div className={design.grid_overlay}>
                        <div className="flex flex-col">
                          <button
                            className={design.grid_overlay_preview}
                            onClick={() => openModal(userCreatedTemplates[key])}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() =>
                              handleUseTemplate(userCreatedTemplates[key])
                            }
                            className={design.grid_overlay_use_template}
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

EmailTemplates.propTypes = {
  triggerId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

export default EmailTemplates;

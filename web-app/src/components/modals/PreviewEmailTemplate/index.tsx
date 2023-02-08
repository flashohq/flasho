import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PreviewEmailTemplates = (props: any) => {
  const { open, closeModal, templateData, handleUseTemplate } = props;

  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const enableDesktop = () => setIsDesktop(true);
  const enableMobile = () => setIsDesktop(false);

  useEffect(() => {
    setIsDesktop(true);
  }, [open]);

  return (
    <div className={`modal_body ${open ? 'fixed' : 'hidden'}`}>
      <div className="modal_container w-[90vw]">
        <div
          id="modal_header"
          className="h_stack h-16 justify-between rounded-t-lg bg-[#2e5cb2] p-3.5"
        >
          <p className="px-5 text-xl font-semibold text-[#f1faee]">Preview</p>
          <div className="h_stack">
            <button
              className="rounded bg-[#ff4772] p-2 px-4 font-bold text-[#f1faee] hover:bg-[#fe6d8f]"
              onClick={() => handleUseTemplate(templateData)}
            >
              Use Template
            </button>
            <img
              src="/icons/cross_white.svg"
              className="ml-2 h-9 w-9 cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
        <div id="modal_content" className="flex h-[85vh] flex-col">
          <div className="relative flex h-16 items-center">
            <div className="h_stack absolute w-full">
              <button
                disabled={isDesktop}
                className={`${
                  isDesktop ? 'bg-[#2e5cb2]' : 'bg-[#dde9ff]'
                } m-1 rounded-lg px-4 py-2.5`}
                onClick={enableDesktop}
                data-cy="desktopMode"
              >
                <img
                  src={
                    `/icons/desktop_` +
                    `${isDesktop ? 'white.svg' : 'blue.svg'}`
                  }
                />
              </button>
              <button
                disabled={!isDesktop}
                className={`${
                  !isDesktop ? 'bg-[#2e5cb2]' : 'bg-[#dde9ff]'
                } m-1 rounded-lg px-4 py-2.5`}
                onClick={enableMobile}
                data-cy="mobileMode"
              >
                <img
                  src={
                    `/icons/mobile_` +
                    `${!isDesktop ? 'white.svg' : 'blue.svg'}`
                  }
                />
              </button>
            </div>
            <div className="absolute flex items-center">
              <p className="ml-10 text-left text-xl font-medium">
                {templateData.title}
              </p>
            </div>
          </div>

          <div className="flex h-[calc(100%-100px)] w-full justify-center overflow-y-auto bg-[lightgray]">
            {isDesktop && (
              <div
                className="h-full w-4/5"
                dangerouslySetInnerHTML={{ __html: templateData.body_html }}
              />
            )}
            {!isDesktop && (
              <div
                className="h-[844px] w-[390px]"
                dangerouslySetInnerHTML={{ __html: templateData.body_html }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PreviewEmailTemplates.propTypes = {
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  templateData: PropTypes.object,
  handleUseTemplate: PropTypes.func
};

export default PreviewEmailTemplates;

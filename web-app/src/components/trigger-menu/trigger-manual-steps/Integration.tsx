import { CopyIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import Select from 'react-select';
import { useState } from 'react';
import { CodeBlock, dracula } from 'react-code-blocks';
import { useSelector } from 'react-redux';
import { useNotification } from '../../../Notifications/NotificationProvider';
import { RootState } from '../../../redux/store';
import { customStyles } from '../../../styles/styled-selectors';
import codeblocks from './codeblocks';

const IntegrationManual = () => {
  const {
    name,
    configuration: {
      variables: { manual: manualVariables }
    }
  } = useSelector((state: RootState) => state.trigger_drafts.current);
  const [language, setLanguage] = useState(codeblocks['JS Fectch'].language);
  const [code, setCode] = useState(
    codeblocks['JS Fectch'].code(
      name,
      window.location.origin,
      window.localStorage.ADMIN_SECRET_KEY,
      manualVariables
    )
  );

  const options = Object.keys(codeblocks).map((key: string) => ({
    value: codeblocks[key].language,
    label: key
  }));

  const notification = useNotification();
  const notificationID = 'emailTemplateError';

  const copyText = async (code: string) => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(code);
    }
    if (!notification.isActive(notificationID)) {
      notification({
        id: notificationID,
        title: `Snippet copied to clipboard`,
        status: 'success'
      });
    }
  };
  return (
    <div className="relative h-full w-full flex-grow bg-white">
      <div className="step_container">
        <section className="step_header">
          <h2>Integrate this trigger in you codebase</h2>
        </section>
        <div className="relative mt-1 flex w-full flex-col items-center">
          <div className="my-4 flex items-center justify-center">
            <Select
              options={options}
              styles={customStyles}
              placeholder="JS Fetch"
              onChange={(e: any) => {
                setLanguage(e.value);
                setCode(
                  codeblocks[e.label].code(
                    name,
                    window.location.origin,
                    window.localStorage.ADMIN_SECRET_KEY,
                    manualVariables
                  )
                );
              }}
            />
          </div>

          <div className=" absolute top-20 right-4 flex h-12 w-12 items-center justify-center">
            <IconButton
              icon={<CopyIcon />}
              aria-label={'Copy Snippet'}
              h={'40px'}
              w={'40px'}
              onClick={() => copyText(code)}
            />
          </div>
          <CodeBlock
            text={code}
            language={language}
            customStyle={{
              height: '500px',
              width: '100%',
              overflow: 'scroll',
              fontSize: '18px'
            }}
            showLineNumbers={true}
            theme={dracula}
          />
        </div>
      </div>
      <section className="absolute bottom-0 flex h-20 w-full items-center justify-center"></section>
    </div>
  );
};

export default IntegrationManual;

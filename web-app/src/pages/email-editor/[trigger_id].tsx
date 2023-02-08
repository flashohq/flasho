import Head from 'next/head';
import { ReactElement, useEffect, useState } from 'react';
import Favicon from '../../components/favicon/Favicon';
import Email from '../../components/layout/email';
import design from '../../styles/PageDefault.module.scss';
import dynamic from 'next/dynamic';

const EmailEditor = dynamic(() => import('../../components/email-editor'), {
  ssr: false
});
import { Box, Button, Flex } from '@chakra-ui/react';
import { useNotification } from '../../Notifications/NotificationProvider';
import TestEmail from '../../components/modals/TestEmail';
import SendEmail from '../../components/modals/SendEmail';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const EmailEdit = () => {
  const router = useRouter();
  const { trigger_id }: any = router.query;

  const dispatch = useDispatch();

  const {
    configuration: {
      variables: { primary, derived, manual }
    },
    event,
    email_template_id,
    creation_status: creationStatus,
    isEdit
  } = useSelector((state: RootState) => state.trigger_drafts.current);

  let emailTemplate: any;

  if (email_template_id) {
    const { [email_template_id]: template } = useSelector(
      (state: RootState) => state.email_templates.user
    );
    emailTemplate = template;
  } else {
    emailTemplate = {};
  }

  const variables = [
    ...manual,
    ...Object.keys(primary),
    ...Object.keys(derived)
  ].map(variableName => {
    return { name: variableName, value: `{{${variableName}}}` };
  });

  const {
    body_html: bodyHtml,
    body_design: bodyDesign,
    subject
  } = emailTemplate;

  const toast = useNotification();
  const toastId = 'testEmail';
  const toastId2 = 'emailValidation';
  const toastId3 = 'bodyValidation';
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

  const validateEmail = (emailId: string) => {
    return emailId
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const sendTestEmail = (emailId: string) => {
    if (validateEmail(emailId)) {
      setSubmitLoading(true);
      let message = bodyHtml;
      let subjectForTestEmail = subject;
      console.log({ testEmailVariables });
      Object.keys(testEmailVariables).forEach((key: string) => {
        message = message.replace(key, testEmailVariables[key]);
      });

      Object.keys(testEmailVariables).forEach((key: string) => {
        console.log({ key });
        subjectForTestEmail = subjectForTestEmail.replace(
          key,
          testEmailVariables[key]
        );
      });
      //@ts-ignore
      const reqBody = {
        service_name: emailTemplate.service_name,
        recipient_addresses: [emailId],
        subject: subjectForTestEmail,
        body_html: message
      };

      axiosInstance
        .post('/v1/email/send_email', reqBody)
        .then(res => {
          console.log(res.data);
          if (!toast.isActive(toastId)) {
            toast({
              id: toastId,
              title: `Email sent successfully`,
              status: 'success'
            });
          }
          setSubmitLoading(false);
          setTestEmailModal(false);
        })
        .catch(e => {
          console.log(e);
          if (!toast.isActive(toastId)) {
            toast({
              id: toastId,
              title: `Email sending failed`,
              status: 'danger'
            });
          }
          setSubmitLoading(false);
        });
    } else {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          title: `Please enter a valid email address`,
          status: 'danger'
        });
      }
    }
  };

  const submitTrigger = () => {
    if (trigger_id[0] === 'd') {
      insertTrigger();
    } else {
      updateTrigger();
    }
  };

  const insertTrigger = () => {
    dispatch.email_templates.CREATE_EMAIL_TEMPLATE({
      email_template_id: trigger_id
    });
  };

  useEffect(() => {
    if (creationStatus === 'success' || creationStatus === 'update_success') {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: `Trigger ${
            creationStatus === 'success' ? 'created' : 'updated'
          } successfully, redirecting...`,
          status: 'success'
        });
      }
      setSendEmailModal(false);
      setTimeout(() => {
        if (event === 'MANUAL') {
          dispatch.trigger_drafts.updateValue({
            key: 'activeTab',
            value: 'Integration'
          });
          router.replace(`/email/${trigger_id}`);
        } else {
          router.replace(`/email/all`);
        }
      }, 2000);
    } else if (
      creationStatus === 'failed' ||
      creationStatus === 'update_failed'
    ) {
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: `Some error occured, please try again`,
          status: 'danger'
        });
      }
    }
  }, [creationStatus]);

  const updateTrigger = () => {
    dispatch.email_templates.DO_UPDATE_EMAIL_TEMPLATE();
  };

  const [testEmailModal, setTestEmailModal] = useState<boolean>(false);
  const [sendEmailModal, setSendEmailModal] = useState<boolean>(false);

  const openModal = (modalType: string) => {
    if (bodyHtml.length === 0) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          title: 'Please draft an email first',
          status: 'danger'
        });
      }
    } else {
      if (modalType === 'test') setTestEmailModal(true);
      else setSendEmailModal(true);
    }
  };

  const [testEmailVariables, setTestEmailVariables] = useState<any>();

  useEffect(() => {
    let regex = /\{\{[^}]*\}\}/gim;
    let matchedVars = bodyHtml?.match(regex);
    console.log('Matched Data', matchedVars);
    let subjectVars = subject?.match(regex);
    let subjectVariables = subjectVars
      ? subjectVars.reduce(
          (acc: { [x: string]: string }, curr: string | number) => (
            (acc[curr] = ''), acc
          ),
          {}
        )
      : {};
    const testEmailVar = matchedVars
      ? matchedVars.reduce(
          (acc: { [x: string]: string }, curr: string | number) => (
            (acc[curr] = ''), acc
          ),
          {}
        )
      : {};

    const allVars = { ...testEmailVar, ...subjectVariables };
    setTestEmailVariables(allVars);
  }, [bodyHtml, testEmailModal, subject]);

  console.log(
    window.location.protocol + '//' + window.location.host + '/custom.js'
  );

  return (
    <div className={design.container}>
      <TestEmail
        open={testEmailModal}
        closeModal={() => setTestEmailModal(false)}
        testEmailVariables={testEmailVariables}
        setTestEmailVariables={setTestEmailVariables}
        submit={sendTestEmail}
        submitLoading={submitLoading}
      />
      <SendEmail
        open={sendEmailModal}
        closeModal={() => setSendEmailModal(false)}
        submit={submitTrigger}
        submitLoading={
          creationStatus === 'creating' ||
          creationStatus === 'update_in_progress'
        }
        submitDisabled={submitDisabled}
      />
      <Head>
        <title>Flasho App</title>
        <meta
          name="description"
          content="A one stop for all notifications - sms, emails & notifications"
        />
        <Favicon />
      </Head>
      <Box w={'100%'} h={'100%'}>
        <Flex
          h={'4rem'}
          w={'100%'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          padding={'0 1rem'}
          bg={'#f1faee'}
          position={'relative'}
        >
          <img
            src={'/icons/arrow-back.svg'}
            className={'absolute left-2 h-8 w-8 hover:opacity-80'}
            onClick={() => router.back()}
          />
          <Button
            width={'8rem'}
            height={'2.5rem'}
            marginX={'1rem'}
            color={'#ff4772'}
            variant={'ghost'}
            style={{ border: '2px solid #ff4772' }}
            fontSize={'xl'}
            _hover={{ bg: '#ff4772', color: '#f1faee' }}
            onClick={() => openModal('test')}
          >
            Test
          </Button>
          <Button
            bg={'#ff4772'}
            color={'#f1faee'}
            width={'8rem'}
            height={'2.5rem'}
            _hover={{ bg: '#ff4772cc', color: '#f1faee' }}
            onClick={() => {
              openModal('submit');
            }}
            isDisabled={submitDisabled}
          >
            {isEdit ? 'Save Changes' : 'Submit'}
          </Button>
        </Flex>
        <Box
          w={'100%'}
          h={'calc(100% - 4rem)'}
          display={'flex'}
          paddingTop={'2px'}
        >
          {variables !== null && (
            <EmailEditor
              projectId={1071}
              setBodyDesign={(design: object) =>
                dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
                  email_template_id: trigger_id,
                  key: 'body_design',
                  value: design
                })
              }
              setBodyHtml={(html: string) =>
                dispatch.email_templates.UPDATE_EMAIL_TEMPLATE({
                  email_template_id: trigger_id,
                  key: 'body_html',
                  value: html
                })
              }
              bodyDesign={bodyDesign}
              trigger_id={trigger_id}
              style={{ height: '100%' }}
              options={{
                customJS: [
                  window.location.protocol +
                    '//' +
                    window.location.host +
                    '/custom.js'
                ],
                mergeTags: variables
              }}
            />
          )}
        </Box>
      </Box>
    </div>
  );
};

EmailEdit.getLayout = (page: ReactElement) => {
  return <Email>{page}</Email>;
};

export async function getServerSideProps(context: any) {
  return {
    props: {}
  };
}

export default EmailEdit;

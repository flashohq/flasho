import Link from 'next/link';
import { useRouter } from 'next/router';

export default (props: any) => {
  const route = useRouter();
  const dummyId = `d${Math.floor(Math.random() * 1000000 + 1)}`;
  return (
    <main className="main_layout_container">
      <div className="main_navbar">
        <div className="sidebar_navbar_top">
          <Link href={'/'}>
            <img
              src={'/logo/logo.svg'}
              className={'navbar_logo'}
              data-cy="icon"
            />
          </Link>
        </div>
        <div className="content_navbar_top">
          <div className="flex w-full items-center justify-end pr-4">
            <Link href={'/help'}>
              <div className="mr-4 cursor-pointer text-2xl font-semibold">
                Help
              </div>
            </Link>
            <Link href={'/setup/integration'}>
              <div className="mr-4 flex cursor-pointer items-center justify-center">
                <img
                  src={'/icons/setting.svg'}
                  width={'30px'}
                  height={'30px'}
                  data-cy="settingIcon"
                />
              </div>
            </Link>
            <Link href={'/'}>
              <div className="mr-2 flex cursor-pointer items-center justify-center">
                <img
                  src={'/icons/heart.svg'}
                  width={'30px'}
                  height={'30px'}
                  data-cy="heartIcon"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="main_container">
        <div className="main_sidebar">
          <div className="sidebar_menu_container">
            <div className="sidebar_menu_wrap">
              <Link
                href={
                  route.pathname == `/` ||
                  route.pathname.slice(0, 6) == '/email'
                    ? 'javascript:void(0)'
                    : '/'
                }
              >
                <div
                  className={
                    route.pathname == `/` ||
                    route.pathname.slice(0, 6) == '/email'
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                >
                  <img
                    src={'/icons/email.svg'}
                    width={'35px'}
                    height={'35px'}
                  />
                  <p className="navbar_link_text">Email Notifications</p>
                </div>
              </Link>
              <Link
                href={
                  route.pathname == `/sms` ||
                  route.pathname.slice(0, 4) == '/sms'
                    ? 'javascript:void(0)'
                    : '/sms'
                }
              >
                <div
                  className={
                    route.pathname == `/sms` ||
                    route.pathname.slice(0, 4) == '/sms'
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                >
                  <img src={'/icons/sms.svg'} width={'35px'} height={'35px'} />
                  <p className="navbar_link_text">SMS Notifications</p>
                </div>
              </Link>
              <Link
                href={
                  route.pathname.slice(0, 9) == `/triggers`
                    ? 'javascript:void(0)'
                    : `/triggers/${dummyId}`
                }
              >
                <div
                  className={
                    route.pathname.slice(0, 9) == `/triggers`
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                >
                  <img
                    src={'/icons/triggers.svg'}
                    width={'35px'}
                    height={'35px'}
                  />
                  <p className="navbar_link_text">Triggers</p>
                </div>
              </Link>
              <Link
                href={
                  route.pathname.slice(0, 4) == `/log`
                    ? 'javascript:void(0)'
                    : '/log/sms'
                }
              >
                <div
                  className={
                    route.pathname.slice(0, 4) == `/log`
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                >
                  <img src={'/icons/logs.svg'} width={'35px'} height={'35px'} />
                  <p className="navbar_link_text">Logs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="main_content">
          <div className="content_container">{props.children}</div>
        </div>
      </div>
    </main>
  );
};

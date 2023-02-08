import Link from 'next/link';
import { useRouter } from 'next/router';

export default (props: any) => {
  const route = useRouter();
  return (
    <main className="main_layout_container">
      <div className="main_navbar">
        <div className="sidebar_navbar_top">
          <Link href={'/'}>
            <img
              src={'/logo/logo.svg'}
              className={'navbar_logo'}
              data-cy="logo"
            />
          </Link>
        </div>
        <div className="content_navbar_top">
          <div className="flex w-full items-center justify-end pr-4">
            <Link href={'/help'}>
              <div className="mr-4 cursor-pointer text-2xl font-bold">Help</div>
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
              <Link href={'/setup/integration'}>
                <div
                  className={
                    route.pathname == '/setup/integration'
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                >
                  <img
                    src={'/icons/integrations.svg'}
                    width={'35px'}
                    height={'35px'}
                  />
                  <p className="navbar_link_text">Integrations</p>
                </div>
              </Link>
              <Link href={'/setup/logout'}>
                <div
                  className={
                    route.pathname == '/setup/logout'
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                  data-cy="logout"
                >
                  <img src={'/icons/lock.svg'} width={'35px'} height={'35px'} />
                  <p className="navbar_link_text">Logout</p>
                </div>
              </Link>
              <Link href={'/setup/about'}>
                <div
                  className={
                    route.pathname == `/setup/about`
                      ? 'navbar_link_active'
                      : 'navbar_link'
                  }
                  data-cy="about"
                >
                  <img
                    src={'/icons/about.svg'}
                    width={'35px'}
                    height={'35px'}
                  />
                  <p className="navbar_link_text">About</p>
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

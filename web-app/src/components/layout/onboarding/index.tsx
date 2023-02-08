import Link from 'next/link';

export default (props: any) => {
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
                />
              </div>
            </Link>
            <Link href={'/'}>
              <div className="mr-2 flex cursor-pointer items-center justify-center">
                <img src={'/icons/heart.svg'} width={'30px'} height={'30px'} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="main_container">
        <div className="content_container pt-[2px]">{props.children}</div>
      </div>
    </main>
  );
};

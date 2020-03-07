import Link from 'next/link'

// eslint-disable-next-line react/display-name
export default () => (
    <div>
        This is a static page goto{' '}
        <Link href="/">
            <a>dynamic</a>
        </Link>{' '}
        page.
  </div>
)
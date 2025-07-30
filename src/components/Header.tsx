import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	const u = new URL(window.location.href)

	return (
		<header>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					OpenTier
				</a>
				<span>
				{ u.pathname }
				</span>
			</nav>
		</header>
	);
}

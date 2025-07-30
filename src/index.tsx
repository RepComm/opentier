import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import './style.css';
import { Tier } from './pages/tier/index.js';

window.addEventListener("wheel", (evt)=>{
	evt.preventDefault();
}, {passive: false })
window.addEventListener("touchstart", (evt)=>{
	evt.preventDefault();
}, { passive: false })

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/:tierid" component={Tier} />
					<Route default component={Home} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));

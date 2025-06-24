import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:6006',
		setupNodeEvents(on) {
			addMatchImageSnapshotPlugin(on)
		}
	}
})
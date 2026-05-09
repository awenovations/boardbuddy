<script lang="ts">
	import DarkModeImage from '$lib/assets/dark-mode-board.png';
	import LightModeImage from '$lib/assets/light-mode-board.png';

	let { children } = $props();
</script>

<div class="background-wrapper">
  <div class="backdrop"></div>
  <div class="background-image">
    <image class="dark-mode-image" src={DarkModeImage} />
    <image class="light-mode-image" src={LightModeImage} />
  </div>
</div>

<div class="wrapper">
	<div class="paywall-layout">
		<div class="paywall-logo">
			<div class="logo">
				<span class="name">Board Buddy</span>
				Simplify Your Workflow
			</div>
		</div>

		{@render children?.()}
	</div>
</div>

<style lang="scss">

  .background-wrapper {
    width: 100%;
    height: 1000px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

	.wrapper {
		display: flex;
		justify-content: center;
		flex-direction: column;
		height: 100%;
		align-items: center;
		overflow: hidden;
	}

	:global(.right-user-actions) {
		position: relative;
		z-index: 30;
	}

	.paywall-logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		:global(.logo) {
			align-items: center;
		}
	}

	.paywall-layout {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		transform: translateY(-6rem);
		position: relative;
		z-index: 20;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		z-index: 10;
		backdrop-filter: blur(0.714rem);

		@media (prefers-color-scheme: light) {
			background: rgba(230, 230, 230, 0.3);
		}

		@media (prefers-color-scheme: dark) {
			background: rgba(0, 0, 0, 0.5);
		}
	}

	.background-image {
		user-select: none;
		.light-mode-image,
		.dark-mode-image {
			position: absolute;
			top: 10.714rem;
			left: 50%;
			transform: translateX(-50%);
		}

		.dark-mode-image {
			@media (prefers-color-scheme: light) {
				display: none;
			}
		}
		.light-mode-image {
			@media (prefers-color-scheme: dark) {
				display: none;
			}
		}
	}
</style>

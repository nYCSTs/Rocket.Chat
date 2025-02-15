import { expect, test } from './utils/test';
import { HomeChannel } from './page-objects';
import { createTargetChannel, createTargetTeam, createDirectMessage } from './utils';

test.use({ storageState: 'user1-session.json' });

test.describe('video conference', () => {
	let poHomeChannel: HomeChannel;
	let targetChannel: string;
	let targetReadOnlyChannel: string;
	let targetTeam: string;

	test.beforeAll(async ({ api }) => {
		targetChannel = await createTargetChannel(api);
		targetReadOnlyChannel = await createTargetChannel(api, { readOnly: true });
		targetTeam = await createTargetTeam(api);
		await createDirectMessage(api);
	});

	test.beforeEach(async ({ page }) => {
		poHomeChannel = new HomeChannel(page);

		await page.goto('/home');
	});

	test('expect create video conference in a "targetChannel"', async () => {
		await poHomeChannel.sidenav.openChat(targetChannel);

		await poHomeChannel.content.btnCall.click();
		await poHomeChannel.content.btnStartCall.click();
		await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
	});

	test.describe('test received in a "target channel"', async () => {
		test.use({ storageState: 'user2-session.json' });
		test('verify if user received a invite call from "targetChannel"', async () => {
			await poHomeChannel.sidenav.openChat(targetChannel);
			await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
		});
	});

	test('expect create video conference in a direct', async () => {
		await poHomeChannel.sidenav.openChat('user2');

		await poHomeChannel.content.btnCall.click();
		await poHomeChannel.content.btnStartCall.click();
		await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
	});

	test.describe('verify if user received from a direct', async () => {
		test.use({ storageState: 'user2-session.json' });
		test('verify if user received a call invite in direct', async () => {
			await poHomeChannel.sidenav.openChat('user1');
			await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
		});
	});

	test('expect create video conference in a "targetTeam"', async () => {
		await poHomeChannel.sidenav.openChat(targetTeam);

		await poHomeChannel.content.btnCall.click();
		await poHomeChannel.content.btnStartCall.click();
		await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
	});

	test.describe('verify if received from a "targetTeam"', async () => {
		test.use({ storageState: 'user2-session.json' });
		test('verify if user received from a "targetTeam"', async () => {
			await poHomeChannel.sidenav.openChat(targetTeam);
			await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
		});
	});

	test('expect create video conference in a direct multiple', async () => {
		await poHomeChannel.sidenav.openChat('rocketchat.internal.admin.test, user2');

		await poHomeChannel.content.btnCall.click();
		await poHomeChannel.content.btnStartCall.click();
		await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
	});

	test.describe('received in a direct multiple', async () => {
		test.use({ storageState: 'user2-session.json' });
		test('verify if user received from a multiple', async () => {
			await poHomeChannel.sidenav.openChat('rocketchat.internal.admin.test, user1');
			await expect(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
		});
	});

	test('expect create video conference not available in a "targetReadOnlyChannel"', async () => {
		await poHomeChannel.sidenav.openChat(targetReadOnlyChannel);

		await expect(poHomeChannel.content.btnCall).hasAttribute('disabled');
	});
});

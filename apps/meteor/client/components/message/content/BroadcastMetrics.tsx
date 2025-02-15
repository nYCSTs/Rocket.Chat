import type { IMessage } from '@rocket.chat/core-typings';
import { MessageBlock, MessageMetrics, MessageMetricsReply } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';
import React from 'react';

import { useChat } from '../../../views/room/contexts/ChatContext';
import { useBlockRendered } from '../hooks/useBlockRendered';

type BroadcastMetricsProps = {
	username: string;
	message: IMessage;
};

const BroadcastMetrics = ({ username, message }: BroadcastMetricsProps): ReactElement => {
	const t = useTranslation();
	const { className, ref } = useBlockRendered<HTMLDivElement>();

	const chat = useChat();

	const handleReplyButtonClick = () => {
		chat?.flows.replyBroadcast(message);
	};

	return (
		<MessageBlock>
			<MessageMetrics>
				<div className={className} ref={ref} />
				<MessageMetricsReply data-username={username} data-mid={message._id} onClick={handleReplyButtonClick}>
					{t('Reply')}
				</MessageMetricsReply>
			</MessageMetrics>
		</MessageBlock>
	);
};

export default BroadcastMetrics;

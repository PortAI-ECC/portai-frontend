import styled from '@emotion/styled';

// PortAI 자체 톤 3종 중 "클래식". 아이보리 배경 + Noto Serif KR 헤딩 + 얇은 보더로,
// Claude Design 3종(Minimal/Colorful/Editorial)과 같은 구조화 데이터(portfolioTemplateData)를 그린다.
const SERIF = "'Noto Serif KR', serif";

const Page = styled.div`
	background: #fbf8f2;
	color: #5b5a56;
	padding: 72px 40px 120px;
	line-height: 1.75;
`;

const Inner = styled.div`
	max-width: 1180px;
	margin: 0 auto;
`;

const Hero = styled.section`
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 36px;
	align-items: center;
	padding-bottom: 40px;
	border-bottom: 1px solid rgba(34, 36, 43, 0.16);

	@media (max-width: 860px) {
		grid-template-columns: auto 1fr;
	}
`;

const Avatar = styled.div`
	width: 84px;
	height: 84px;
	border-radius: 50%;
	background: repeating-linear-gradient(135deg, #efe9dc 0 6px, #f6f3ec 6px 12px);
	display: grid;
	place-items: center;
	font-family: ${SERIF};
	font-weight: 500;
	font-size: 22px;
	color: #8a6a3b;
`;

const Eyebrow = styled.p`
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: #8a6a3b;
	text-transform: uppercase;
	margin-bottom: 10px;
`;

const Name = styled.h1`
	margin: 0;
	font-family: ${SERIF};
	font-weight: 500;
	font-size: 36px;
	color: #22242b;
	letter-spacing: -0.01em;
`;

const Sub = styled.p`
	margin: 6px 0 0;
	font-size: 13px;
	color: #9a968c;
`;

const Contact = styled.div`
	text-align: right;
	font-size: 13px;
	line-height: 2;

	a {
		color: #22242b;
		text-decoration: none;
		border-bottom: 1px solid rgba(34, 36, 43, 0.16);
	}
	a:hover {
		color: #8a6a3b;
		border-color: #8a6a3b;
	}

	@media (max-width: 860px) {
		display: none;
	}
`;

const Tagline = styled.p`
	grid-column: 1 / -1;
	margin: 24px 0 0;
	font-size: 16px;
	line-height: 1.85;
	max-width: 70ch;
`;

const LinkRow = styled.div`
	grid-column: 1 / -1;
	margin-top: 6px;
	display: flex;
	flex-wrap: wrap;
	gap: 8px 22px;
	font-size: 13px;
`;

const LinkChip = styled.a`
	color: #22242b;
	border-bottom: 1px solid rgba(34, 36, 43, 0.16);
	padding-bottom: 2px;
	text-decoration: none;

	&:hover {
		color: #8a6a3b;
		border-color: #8a6a3b;
	}
`;

const Section = styled.section`
	margin-top: 56px;
`;

const SectionHead = styled.div`
	display: flex;
	align-items: baseline;
	gap: 12px;
	border-top: 1px solid rgba(34, 36, 43, 0.16);
	padding-top: 14px;
	margin-bottom: 22px;
`;

const SectionLabel = styled.span`
	font-family: ${SERIF};
	font-weight: 600;
	font-size: 15px;
	letter-spacing: 0.06em;
	color: #22242b;
`;

const HotBadge = styled.span`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.06em;
	color: #8a6a3b;
	border: 1px solid #8a6a3b;
	padding: 2px 9px;
	border-radius: 4px;
`;

const BorderedGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${({ $min }) => $min || 300}px, 1fr));
	border: 1px solid rgba(34, 36, 43, 0.16);
`;

const Cell = styled.div`
	padding: 26px 28px;
	border-right: 1px solid rgba(34, 36, 43, 0.16);
	border-bottom: 1px solid rgba(34, 36, 43, 0.16);
	background: #fff;

	&:last-of-type {
		border-bottom: none;
	}
`;

const RecordGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${({ $min }) => $min || 320}px, 1fr));
	border-top: 1px solid rgba(34, 36, 43, 0.16);
`;

const RecordCell = styled.div`
	padding: 22px 26px;
	border-right: 1px solid rgba(34, 36, 43, 0.16);
	border-bottom: 1px solid rgba(34, 36, 43, 0.16);
`;

const SkillGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 28px 32px;
`;

const ProjectName = styled.p`
	margin: 0;
	font-family: ${SERIF};
	font-weight: 600;
	font-size: 17px;
	color: #22242b;
`;

const Meta = styled.p`
	margin: 6px 0 0;
	font-size: 11.5px;
	color: #9a968c;
	letter-spacing: 0.04em;
`;

const Desc = styled.p`
	margin: 12px 0 0;
	font-size: 14.5px;
	line-height: 1.75;
`;

const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px 8px;
	margin-top: 14px;
`;

const Tag = styled.span`
	font-size: 11px;
	color: #5b5a56;
	border: 1px solid rgba(34, 36, 43, 0.16);
	padding: 3px 9px;
	border-radius: 4px;
`;

const ProjectLinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 14px;
	font-size: 12px;

	a {
		color: #8a6a3b;
	}
`;

const SkillLabel = styled.p`
	margin: 0 0 8px;
	font-size: 13px;
	font-weight: 600;
	color: #22242b;
`;

const SkillText = styled.p`
	margin: 0;
	font-size: 12.5px;
	line-height: 1.9;
	color: #9a968c;
	letter-spacing: 0.01em;
`;

const RecordPeriod = styled.p`
	margin: 0;
	font-size: 11px;
	color: #9a968c;
	letter-spacing: 0.04em;
`;

const RecordTitle = styled.p`
	margin: 6px 0 0;
	font-size: 15px;
	font-weight: 600;
	color: #22242b;
`;

const RecordDesc = styled.p`
	margin: 6px 0 0;
	font-size: 13.5px;
	line-height: 1.7;
`;

const Intro = styled.p`
	grid-column: 1 / -1;
	margin: 20px 0 0;
	font-size: 14.5px;
	line-height: 1.85;
	color: #5b5a56;
	white-space: pre-wrap;
`;

const Footer = styled.footer`
	text-align: center;
	margin-top: 64px;
	font-size: 12px;
	color: #9a968c;
`;

function ClassicTemplate({ data, showPhoto = true }) {
	const { profile, mailto, intro, links, projects, skills, sections, projectsHot } = data;
	const footerLine = [profile.name, profile.email, 'MADE WITH PORTAI']
		.filter(Boolean)
		.join(' · ');

	return (
		<Page>
			<Inner>
				<Hero>
					{showPhoto && <Avatar>{profile.initials}</Avatar>}
					<div>
						{profile.desiredJob && <Eyebrow>{profile.desiredJob}</Eyebrow>}
						<Name>{profile.name}</Name>
						{profile.major && <Sub>{profile.major}</Sub>}
					</div>
					<Contact>
						{profile.email && (
							<div>
								<a href={mailto}>{profile.email}</a>
							</div>
						)}
						{profile.phone && <div>{profile.phone}</div>}
					</Contact>
					{profile.tagline && <Tagline>{profile.tagline}</Tagline>}
					{intro && <Intro>{intro}</Intro>}
					{links.length > 0 && (
						<LinkRow>
							{links.map((link) => (
								<LinkChip key={link.id} href={link.url}>
									{link.label} ↗
								</LinkChip>
							))}
						</LinkRow>
					)}
				</Hero>

				{projects.length > 0 && (
					<Section>
						<SectionHead>
							<SectionLabel>프로젝트</SectionLabel>
							{projectsHot && <HotBadge>강조</HotBadge>}
						</SectionHead>
						<BorderedGrid $min={300}>
							{projects.map((project) => (
								<Cell key={project.id}>
									<ProjectName>{project.title}</ProjectName>
									<Meta>
										{[project.period, project.role].filter(Boolean).join(' · ')}
									</Meta>
									{project.desc && <Desc>{project.desc}</Desc>}
									{project.stack.length > 0 && (
										<TagRow>
											{project.stack.map((tech) => (
												<Tag key={tech}>{tech}</Tag>
											))}
										</TagRow>
									)}
									{project.links.length > 0 && (
										<ProjectLinkRow>
											{project.links.map((link) => (
												<a key={link.label} href={link.url}>
													{link.label} ↗
												</a>
											))}
										</ProjectLinkRow>
									)}
								</Cell>
							))}
						</BorderedGrid>
					</Section>
				)}

				{skills.length > 0 && (
					<Section>
						<SectionHead>
							<SectionLabel>기술 스택</SectionLabel>
						</SectionHead>
						<SkillGrid>
							{skills.map((group) => (
								<div key={group.label}>
									<SkillLabel>{group.label}</SkillLabel>
									<SkillText>{group.text}</SkillText>
								</div>
							))}
						</SkillGrid>
					</Section>
				)}

				{sections.map((section) => (
					<Section key={section.key}>
						<SectionHead>
							<SectionLabel>{section.ko}</SectionLabel>
							{section.hot && <HotBadge>강조</HotBadge>}
						</SectionHead>
						<RecordGrid $min={section.items.length > 2 ? 220 : 320}>
							{section.items.map((item) => (
								<RecordCell key={item.id}>
									<RecordPeriod>{item.period}</RecordPeriod>
									<RecordTitle>{item.title}</RecordTitle>
									{item.desc && <RecordDesc>{item.desc}</RecordDesc>}
								</RecordCell>
							))}
						</RecordGrid>
					</Section>
				))}

				{footerLine && <Footer>{footerLine}</Footer>}
			</Inner>
		</Page>
	);
}

export default ClassicTemplate;

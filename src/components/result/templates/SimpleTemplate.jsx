import styled from '@emotion/styled';

// PortAI 자체 톤 3종 중 "심플". 순백 배경 + 흑백 타이포 + 자간 넓은 라벨로,
// Claude Design 3종과 같은 구조화 데이터(portfolioTemplateData)를 그린다.
const Page = styled.div`
	background: #ffffff;
	color: #5f5f5f;
	padding: 88px 40px 140px;
	line-height: 1.8;
`;

const Inner = styled.div`
	max-width: 1180px;
	margin: 0 auto;
`;

const Hero = styled.section`
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 32px;
	align-items: center;
	padding-bottom: 44px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);

	@media (max-width: 860px) {
		grid-template-columns: auto 1fr;
	}
`;

const Avatar = styled.div`
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: #f1f1f1;
	display: grid;
	place-items: center;
	font-weight: 700;
	font-size: 15px;
	color: #111111;
`;

const Eyebrow = styled.p`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: #a0a0a0;
	margin-bottom: 12px;
`;

const Name = styled.h1`
	margin: 0;
	font-weight: 900;
	font-size: 32px;
	color: #111111;
	letter-spacing: -0.01em;
`;

const Sub = styled.p`
	margin: 6px 0 0;
	font-size: 13px;
	color: #a0a0a0;
`;

const Contact = styled.div`
	text-align: right;
	font-size: 12.5px;
	line-height: 2;
	letter-spacing: 0.02em;

	a {
		color: #111111;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 860px) {
		display: none;
	}
`;

const Tagline = styled.p`
	grid-column: 1 / -1;
	margin: 22px 0 0;
	font-size: 15px;
	line-height: 1.9;
	max-width: 72ch;
`;

const LinkRow = styled.div`
	grid-column: 1 / -1;
	margin-top: 4px;
	display: flex;
	flex-wrap: wrap;
	gap: 10px 24px;
	font-size: 12px;
	letter-spacing: 0.04em;
`;

const LinkChip = styled.a`
	color: #111111;
	text-decoration: none;
	border-bottom: 1px solid transparent;

	&:hover {
		border-color: #111111;
	}
`;

const Section = styled.section`
	margin-top: 64px;
`;

const SectionHead = styled.div`
	display: flex;
	align-items: baseline;
	gap: 12px;
	margin-bottom: 26px;
`;

const SectionLabel = styled.span`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: #a0a0a0;
`;

const HotBadge = styled.span`
	font-size: 10px;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: #111111;
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 2px 8px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${({ $min }) => $min || 300}px, 1fr));
	gap: ${({ $gap }) => $gap ?? '0'};
`;

const Cell = styled.div`
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding: 22px 24px 22px 0;
`;

const ProjectName = styled.p`
	margin: 0;
	font-weight: 700;
	font-size: 15px;
	color: #111111;
`;

const Meta = styled.p`
	margin: 5px 0 0;
	font-size: 11px;
	color: #a0a0a0;
	letter-spacing: 0.03em;
`;

const Desc = styled.p`
	margin: 12px 0 0;
	font-size: 13.5px;
	line-height: 1.8;
`;

const TagLine = styled.p`
	margin: 14px 0 0;
	font-size: 11.5px;
	color: #a0a0a0;
`;

const ProjectLinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 12px;
	font-size: 12px;

	a {
		color: #111111;
	}
`;

const SkillGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 24px;
`;

const SkillLabel = styled.p`
	margin: 0 0 10px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #a0a0a0;
`;

const SkillText = styled.p`
	margin: 0;
	font-size: 13px;
	line-height: 1.9;
	color: #5f5f5f;
`;

const RecordGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${({ $min }) => $min || 340}px, 1fr));
	gap: 0 32px;
`;

const RecordCell = styled.div`
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding: 22px 0;
`;

const RecordPeriod = styled.p`
	margin: 0;
	font-size: 11px;
	color: #a0a0a0;
	letter-spacing: 0.03em;
`;

const RecordTitle = styled.p`
	margin: 6px 0 0;
	font-size: 14.5px;
	font-weight: 700;
	color: #111111;
`;

const RecordDesc = styled.p`
	margin: 6px 0 0;
	font-size: 13px;
	line-height: 1.8;
`;

const Intro = styled.p`
	grid-column: 1 / -1;
	margin: 18px 0 0;
	font-size: 13.5px;
	line-height: 1.9;
	color: #5f5f5f;
	white-space: pre-wrap;
`;

const Footer = styled.footer`
	text-align: center;
	margin-top: 96px;
	font-size: 11px;
	letter-spacing: 0.06em;
	color: #a0a0a0;
`;

function SimpleTemplate({ data, showPhoto = true }) {
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
						<Grid $min={300}>
							{projects.map((project) => (
								<Cell key={project.id}>
									<ProjectName>{project.title}</ProjectName>
									<Meta>
										{[project.period, project.role].filter(Boolean).join(' · ')}
									</Meta>
									{project.desc && <Desc>{project.desc}</Desc>}
									{project.stackText && <TagLine>{project.stackText}</TagLine>}
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
						</Grid>
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
						<RecordGrid $min={section.items.length > 2 ? 220 : 340}>
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

export default SimpleTemplate;

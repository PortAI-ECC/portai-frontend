import styled from '@emotion/styled';

// Claude Design "미니멀" 템플릿을 그대로 옮긴 것. 흙색조 배경 + IBM Plex Mono 라벨 +
// 얇은 구분선으로, 문단이 아니라 실제 레코드(프로젝트/기술스택/경력 등) 목록을 그린다.
const MONO = "'IBM Plex Mono', monospace";

const Page = styled.div`
	background: #faf9f7;
	color: #1c1b19;
	padding: 88px 24px 120px;
`;

const Inner = styled.div`
	max-width: 720px;
	margin: 0 auto;
`;

const Header = styled.header`
	display: flex;
	gap: 28px;
	align-items: flex-start;
	flex-wrap: wrap;
`;

const Photo = styled.div`
	width: 92px;
	height: 92px;
	border-radius: 50%;
	flex: none;
	background: repeating-linear-gradient(135deg, #ecebe6 0 6px, #f6f5f1 6px 12px);
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: ${MONO};
	font-size: 8px;
	letter-spacing: 0.08em;
	color: #9a978d;
	text-align: center;
`;

const NameBlock = styled.div`
	flex: 1 1 320px;
`;

const Name = styled.h1`
	margin: 0;
	font-size: 36px;
	font-weight: 500;
	letter-spacing: -0.02em;
`;

const Major = styled.p`
	margin: 8px 0 0;
	font-family: ${MONO};
	font-size: 12px;
	letter-spacing: 0.06em;
	color: #7d7a70;
`;

const Tagline = styled.p`
	margin: 20px 0 0;
	font-size: 17px;
	line-height: 1.75;
	color: #3a3833;
	max-width: 46ch;
`;

const ContactRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px 20px;
	margin-top: 22px;
	font-family: ${MONO};
	font-size: 12.5px;
	color: #5e5b53;
`;

const EmailLink = styled.a`
	border-bottom: 1px solid #cfccc2;
	padding-bottom: 2px;

	&:hover {
		color: oklch(0.52 0.07 145);
		border-color: oklch(0.52 0.07 145);
	}
`;

const SectionLabelRow = styled.div`
	display: flex;
	align-items: baseline;
	gap: 10px;
	border-top: 1px solid #e2e0d9;
	padding-top: 14px;
`;

const SectionLabel = styled.h2`
	margin: 0;
	font-family: ${MONO};
	font-size: 11px;
	font-weight: 500;
	letter-spacing: 0.16em;
	color: #8c887d;
`;

const HotBadge = styled.span`
	font-family: ${MONO};
	font-size: 10px;
	letter-spacing: 0.1em;
	color: oklch(0.52 0.07 145);
`;

const Section = styled.section`
	margin-top: ${({ $first }) => ($first ? '72px' : '56px')};
`;

const ProjectArticle = styled.article`
	padding: 26px 0;
	border-bottom: 1px solid #ece9e1;
`;

const ProjectHead = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
	align-items: baseline;
`;

const ProjectTitle = styled.h3`
	margin: 0;
	font-size: 19px;
	font-weight: 600;
	letter-spacing: -0.01em;
`;

const ProjectPeriod = styled.span`
	font-family: ${MONO};
	font-size: 11.5px;
	color: #918d82;
	white-space: nowrap;
`;

const ProjectRole = styled.p`
	margin: 6px 0 0;
	font-size: 13px;
	color: #6f6b61;
`;

const ProjectDesc = styled.p`
	margin: 12px 0 0;
	font-size: 15.5px;
	line-height: 1.7;
	color: #3d3b35;
`;

const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px 8px;
	margin-top: 14px;
`;

const Tag = styled.span`
	font-family: ${MONO};
	font-size: 11px;
	color: #6b6862;
	border: 1px solid #ddd9cf;
	padding: 3px 8px;
	border-radius: 999px;
`;

const LinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 14px;
	font-family: ${MONO};
	font-size: 12px;
`;

const ProjectLink = styled.a`
	color: oklch(0.52 0.07 145);

	&:hover {
		opacity: 0.7;
	}
`;

const SkillsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 20px 28px;
`;

const SkillLabel = styled.p`
	margin: 0 0 8px;
	font-size: 13px;
	font-weight: 600;
	color: #2b2925;
`;

const SkillText = styled.p`
	margin: 0;
	font-family: ${MONO};
	font-size: 12.5px;
	line-height: 1.9;
	color: #6d6a61;
`;

const RecordRow = styled.div`
	display: grid;
	grid-template-columns: 118px 1fr;
	gap: 4px 20px;
	padding: 18px 0;
	border-bottom: 1px solid #ece9e1;
`;

const RecordPeriod = styled.span`
	font-family: ${MONO};
	font-size: 11.5px;
	color: #918d82;
	padding-top: 3px;
`;

const RecordTitle = styled.p`
	margin: 0;
	font-size: 16px;
	font-weight: 600;
`;

const RecordDesc = styled.p`
	margin: 5px 0 0;
	font-size: 14.5px;
	line-height: 1.65;
	color: #625f57;
`;

const Intro = styled.p`
	margin: 20px 0 0;
	font-size: 14.5px;
	line-height: 1.85;
	color: #3d3b35;
	white-space: pre-wrap;
`;

const Footer = styled.footer`
	margin-top: 64px;
	font-family: ${MONO};
	font-size: 11px;
	letter-spacing: 0.08em;
	color: #a29e93;
`;

function MinimalTemplate({ data, showPhoto = true }) {
	const { profile, mailto, intro, projects, skills, sections, projectsHot } = data;
	const footerLine = [profile.name, profile.email, 'MADE WITH PORTAI'].filter(Boolean).join(' · ');

	return (
		<Page>
			<Inner>
				<Header>
					{showPhoto && (
						<Photo>
							PROFILE
							<br />
							PHOTO
						</Photo>
					)}
					<NameBlock>
						<Name>{profile.name}</Name>
						{profile.major && <Major>{profile.major}</Major>}
						{profile.tagline && <Tagline>{profile.tagline}</Tagline>}
						<ContactRow>
							{profile.email && <EmailLink href={mailto}>{profile.email}</EmailLink>}
							{profile.phone && <span>{profile.phone}</span>}
						</ContactRow>
					</NameBlock>
				</Header>

				{intro && (
					<Section $first>
						<SectionLabelRow>
							<SectionLabel>ABOUT</SectionLabel>
						</SectionLabelRow>
						<Intro>{intro}</Intro>
					</Section>
				)}

				{projects.length > 0 && (
					<Section $first={!intro}>
						<SectionLabelRow>
							<SectionLabel>PROJECTS</SectionLabel>
							{projectsHot && <HotBadge>· 강조</HotBadge>}
						</SectionLabelRow>
						{projects.map((project) => (
							<ProjectArticle key={project.id}>
								<ProjectHead>
									<ProjectTitle>{project.title}</ProjectTitle>
									<ProjectPeriod>{project.period}</ProjectPeriod>
								</ProjectHead>
								{project.role && <ProjectRole>{project.role}</ProjectRole>}
								{project.desc && <ProjectDesc>{project.desc}</ProjectDesc>}
								{project.stack.length > 0 && (
									<TagRow>
										{project.stack.map((tech) => (
											<Tag key={tech}>{tech}</Tag>
										))}
									</TagRow>
								)}
								{project.links.length > 0 && (
									<LinkRow>
										{project.links.map((link) => (
											<ProjectLink key={link.label} href={link.url}>
												{link.label} ↗
											</ProjectLink>
										))}
									</LinkRow>
								)}
							</ProjectArticle>
						))}
					</Section>
				)}

				{skills.length > 0 && (
					<Section>
						<SectionLabelRow style={{ marginBottom: 18 }}>
							<SectionLabel>SKILLS</SectionLabel>
						</SectionLabelRow>
						<SkillsGrid>
							{skills.map((group) => (
								<div key={group.label}>
									<SkillLabel>{group.label}</SkillLabel>
									<SkillText>{group.text}</SkillText>
								</div>
							))}
						</SkillsGrid>
					</Section>
				)}

				{sections.map((section) => (
					<Section key={section.key}>
						<SectionLabelRow>
							<SectionLabel>{section.label}</SectionLabel>
							{section.hot && <HotBadge>· 강조</HotBadge>}
						</SectionLabelRow>
						{section.items.map((item) => (
							<RecordRow key={item.id}>
								<RecordPeriod>{item.period}</RecordPeriod>
								<div>
									<RecordTitle>{item.title}</RecordTitle>
									{item.desc && <RecordDesc>{item.desc}</RecordDesc>}
								</div>
							</RecordRow>
						))}
					</Section>
				))}

				{footerLine && <Footer>{footerLine}</Footer>}
			</Inner>
		</Page>
	);
}

export default MinimalTemplate;

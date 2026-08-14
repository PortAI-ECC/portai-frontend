import styled from '@emotion/styled';

// Claude Design "에디토리얼" 템플릿을 그대로 옮긴 것. Bodoni Moda 세리프 + 붉은 포인트 +
// 이중선(double border)으로 신문/잡지 지면 느낌을 낸다.
const SERIF = "'Bodoni Moda', 'Noto Serif KR', serif";
const SERIF_KR = "'Noto Serif KR', serif";
const MONO = "'IBM Plex Mono', monospace";
const RED = '#b3271e';

const Page = styled.div`
	background: #f3f0e9;
	color: #17171b;
	padding: 0 0 110px;
`;

const Inner = styled.div`
	max-width: 1080px;
	margin: 0 auto;
	padding: 0 32px;
`;

const Topbar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18px 0;
	border-bottom: 1px solid #17171b;
	font-family: ${MONO};
	font-size: 11px;
	letter-spacing: 0.16em;
`;

const Header = styled.header`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 36px;
	padding: 56px 0 44px;
	border-bottom: 3px double #17171b;
`;

const Name = styled.h1`
	margin: 0;
	font-family: ${SERIF};
	font-size: 84px;
	font-weight: 400;
	line-height: 0.9;
	letter-spacing: -0.03em;
`;

const Tagline = styled.p`
	margin: 26px 0 0;
	font-family: ${SERIF_KR};
	font-size: 19px;
	line-height: 1.75;
	max-width: 34ch;
`;

const RightBlock = styled.div`
	display: flex;
	gap: 24px;
	align-items: flex-start;
`;

const Photo = styled.div`
	width: 168px;
	height: 214px;
	flex: none;
	background: repeating-linear-gradient(135deg, #e5e1d7 0 7px, #efece4 7px 14px);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	padding-bottom: 12px;
	font-family: ${MONO};
	font-size: 9px;
	letter-spacing: 0.1em;
	color: #8e8a7e;
`;

const Contact = styled.div`
	font-family: ${MONO};
	font-size: 12px;
	line-height: 2;
	letter-spacing: 0.02em;
`;

const ContactLabel = styled.p`
	margin: 0 0 10px;
	color: ${RED};
`;

const ContactLink = styled.a`
	display: block;

	&:hover {
		color: ${RED};
	}
`;

const ContactLine = styled.span`
	display: block;
`;

const LabelRow = styled.div`
	display: flex;
	align-items: baseline;
	gap: 14px;
	margin-bottom: ${({ $tight }) => ($tight ? '4px' : '8px')};
`;

const Index = styled.span`
	font-family: ${MONO};
	font-size: 12px;
	color: ${RED};
`;

const SectionLabel = styled.h2`
	margin: 0;
	font-family: ${SERIF_KR};
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.24em;
`;

const EmphasisTag = styled.span`
	font-family: ${MONO};
	font-size: 10.5px;
	letter-spacing: 0.12em;
	color: ${RED};
	border: 1px solid ${RED};
	padding: 2px 8px;
`;

const ProjectSection = styled.section`
	padding: 48px 0 0;
`;

const ProjectArticle = styled.article`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 12px 40px;
	padding: 30px 0;
	border-top: 1px solid rgba(23, 23, 27, 0.25);
`;

const ProjectTitle = styled.h3`
	margin: 0;
	font-family: ${SERIF};
	font-size: 30px;
	font-weight: 400;
	line-height: 1.15;
	letter-spacing: -0.02em;
`;

const ProjectMeta = styled.p`
	margin: 10px 0 0;
	font-family: ${MONO};
	font-size: 11.5px;
	letter-spacing: 0.08em;
	color: #5d5a52;
`;

const ProjectDesc = styled.p`
	margin: 0;
	font-family: ${SERIF_KR};
	font-size: 16px;
	line-height: 1.85;
`;

const StackText = styled.p`
	margin: 12px 0 0;
	font-family: ${MONO};
	font-size: 11.5px;
	color: #5d5a52;
	line-height: 1.8;
`;

const LinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 18px;
	margin-top: 12px;
	font-family: ${MONO};
	font-size: 12px;
`;

const ProjectLink = styled.a`
	color: ${RED};
`;

const SkillSection = styled.section`
	padding: 44px 0 0;
	border-top: 3px double #17171b;
	margin-top: 24px;
`;

const SkillGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 24px 40px;
`;

const SkillCell = styled.div`
	border-top: 1px solid rgba(23, 23, 27, 0.25);
	padding-top: 12px;
`;

const SkillLabel = styled.p`
	margin: 0 0 6px;
	font-family: ${MONO};
	font-size: 11px;
	letter-spacing: 0.12em;
	color: ${RED};
`;

const SkillText = styled.p`
	margin: 0;
	font-family: ${SERIF_KR};
	font-size: 15.5px;
	line-height: 1.9;
`;

const RecordSection = styled.section`
	padding: 40px 0 0;
`;

const RecordRow = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 6px 40px;
	padding: 20px 0;
	border-top: 1px solid rgba(23, 23, 27, 0.25);
`;

const RecordTitle = styled.p`
	margin: 0;
	font-family: ${SERIF_KR};
	font-size: 19px;
	font-weight: 600;
	line-height: 1.4;
`;

const RecordMeta = styled.p`
	margin: 6px 0 0;
	font-family: ${MONO};
	font-size: 11.5px;
	letter-spacing: 0.08em;
	color: #5d5a52;
`;

const RecordDesc = styled.p`
	margin: 0;
	font-family: ${SERIF_KR};
	font-size: 15.5px;
	line-height: 1.85;
	align-self: center;
`;

const Footer = styled.footer`
	margin-top: 56px;
	border-top: 3px double #17171b;
	padding-top: 18px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 10px;
	font-family: ${MONO};
	font-size: 11px;
	letter-spacing: 0.14em;
`;

const Intro = styled.p`
	margin: 0;
	padding: 40px 0 0;
	font-family: ${SERIF_KR};
	font-size: 16px;
	line-height: 1.9;
	max-width: 68ch;
	white-space: pre-wrap;
`;

function EditorialTemplate({ data, showPhoto = true }) {
	const { profile, mailto, intro, projects, skills, sections, projectsHot } = data;
	const footerLine = [profile.name, profile.email].filter(Boolean).join(' — ');

	return (
		<Page>
			<Inner>
				<Topbar>
					<span>{profile.major}</span>
					<span>PORTFOLIO / 2026</span>
				</Topbar>

				<Header>
					<div>
						<Name>{profile.name}</Name>
						{profile.tagline && <Tagline>{profile.tagline}</Tagline>}
					</div>
					<RightBlock>
						{showPhoto && <Photo>PROFILE PHOTO</Photo>}
						<Contact>
							<ContactLabel>CONTACT</ContactLabel>
							{profile.email && (
								<ContactLink href={mailto}>{profile.email}</ContactLink>
							)}
							{profile.phone && <ContactLine>{profile.phone}</ContactLine>}
						</Contact>
					</RightBlock>
				</Header>

				{intro && <Intro>{intro}</Intro>}

				{projects.length > 0 && (
					<ProjectSection>
						<LabelRow>
							<Index>{data.projectsNo}</Index>
							<SectionLabel>프로젝트</SectionLabel>
							{projectsHot && <EmphasisTag>EMPHASIS</EmphasisTag>}
						</LabelRow>
						{projects.map((project) => (
							<ProjectArticle key={project.id}>
								<div>
									<ProjectTitle>{project.title}</ProjectTitle>
									<ProjectMeta>
										{[project.period, project.role].filter(Boolean).join(' · ')}
									</ProjectMeta>
								</div>
								<div>
									{project.desc && <ProjectDesc>{project.desc}</ProjectDesc>}
									{project.stackText && <StackText>{project.stackText}</StackText>}
									{project.links.length > 0 && (
										<LinkRow>
											{project.links.map((link) => (
												<ProjectLink key={link.label} href={link.url}>
													{link.label} ↗
												</ProjectLink>
											))}
										</LinkRow>
									)}
								</div>
							</ProjectArticle>
						))}
					</ProjectSection>
				)}

				{skills.length > 0 && (
					<SkillSection>
						<LabelRow>
							<Index>{data.skillsNo}</Index>
							<SectionLabel>기술 스택</SectionLabel>
						</LabelRow>
						<SkillGrid>
							{skills.map((group) => (
								<SkillCell key={group.label}>
									<SkillLabel>{group.label}</SkillLabel>
									<SkillText>{group.text}</SkillText>
								</SkillCell>
							))}
						</SkillGrid>
					</SkillSection>
				)}

				{sections.map((section) => (
					<RecordSection key={section.key}>
						<LabelRow $tight>
							<Index>{section.no}</Index>
							<SectionLabel>{section.ko}</SectionLabel>
							{section.hot && <EmphasisTag>EMPHASIS</EmphasisTag>}
						</LabelRow>
						{section.items.map((item) => (
							<RecordRow key={item.id}>
								<div>
									<RecordTitle>{item.title}</RecordTitle>
									<RecordMeta>{item.period}</RecordMeta>
								</div>
								{item.desc && <RecordDesc>{item.desc}</RecordDesc>}
							</RecordRow>
						))}
					</RecordSection>
				))}

				{footerLine && (
					<Footer>
						<span>{footerLine}</span>
						<span style={{ color: RED }}>MADE WITH PORTAI</span>
					</Footer>
				)}
			</Inner>
		</Page>
	);
}

export default EditorialTemplate;

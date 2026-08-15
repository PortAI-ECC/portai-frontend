import styled from '@emotion/styled';

// Claude Design "컬러풀" 템플릿을 그대로 옮긴 것. 하드 셰도우 카드 + 굵은 보더로,
// 강조된 분류에는 "가장 강조" 배지가 붙는다.
const SG = "'Space Grotesk', sans-serif";
const MONO = "'IBM Plex Mono', monospace";

const Page = styled.div`
	background: #fffdf4;
	color: #14131a;
	padding: 0 0 100px;
`;

const Header = styled.header`
	background: oklch(0.9 0.14 95);
	padding: 64px 28px 56px;
	border-bottom: 3px solid #14131a;
`;

const HeaderInner = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	display: flex;
	gap: 32px;
	align-items: flex-end;
	flex-wrap: wrap;
`;

const Photo = styled.div`
	width: 136px;
	height: 136px;
	flex: none;
	border: 3px solid #14131a;
	border-radius: 28px;
	background: repeating-linear-gradient(
		135deg,
		rgba(20, 19, 26, 0.08) 0 7px,
		rgba(255, 255, 255, 0.35) 7px 14px
	);
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: ${MONO};
	font-size: 9px;
	letter-spacing: 0.08em;
	text-align: center;
	color: #4a463c;
`;

const NameBlock = styled.div`
	flex: 1 1 300px;
`;

const Eyebrow = styled.p`
	margin: 0 0 10px;
	font-family: ${SG};
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.2em;
`;

const Name = styled.h1`
	margin: 0;
	font-size: 64px;
	font-weight: 900;
	line-height: 0.98;
	letter-spacing: -0.035em;
`;

const Major = styled.p`
	margin: 14px 0 0;
	font-size: 17px;
	font-weight: 700;
`;

const Tagline = styled.p`
	margin: 10px 0 0;
	font-size: 18px;
	line-height: 1.6;
	max-width: 40ch;
`;

const Actions = styled.div`
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
`;

const EmailPill = styled.a`
	background: #14131a;
	color: #fffdf4;
	padding: 12px 20px;
	border-radius: 999px;
	font-size: 14px;
	font-weight: 700;

	&:hover {
		background: oklch(0.55 0.2 20);
		text-decoration: none;
	}
`;

const PhonePill = styled.span`
	border: 2px solid #14131a;
	padding: 10px 18px;
	border-radius: 999px;
	font-size: 14px;
	font-weight: 700;
`;

const Content = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	padding: 0 28px;
`;

const SectionTitle = styled.h2`
	margin: 0 0 20px;
	font-size: 28px;
	font-weight: 900;
	letter-spacing: -0.02em;
`;

const HotPill = styled.span`
	font-size: 13px;
	font-weight: 700;
	vertical-align: middle;
	margin-left: 10px;
	background: oklch(0.72 0.19 25);
	color: #fff;
	padding: 5px 12px;
	border-radius: 999px;
`;

const ProjectGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 20px;
`;

const ProjectCard = styled.article`
	background: ${({ $tint }) => $tint};
	border: 3px solid #14131a;
	border-radius: 26px;
	padding: 24px;
	box-shadow: 6px 6px 0 #14131a;
	transition: transform 0.18s ease, box-shadow 0.18s ease;

	&:hover {
		transform: translate(-3px, -3px);
		box-shadow: 10px 10px 0 #14131a;
	}
`;

const ProjectPeriod = styled.span`
	font-family: ${SG};
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.14em;
`;

const ProjectTitle = styled.h3`
	margin: 10px 0 0;
	font-size: 22px;
	font-weight: 900;
	line-height: 1.25;
	letter-spacing: -0.02em;
`;

const ProjectRole = styled.p`
	margin: 6px 0 0;
	font-size: 13px;
	font-weight: 700;
	opacity: 0.7;
`;

const ProjectDesc = styled.p`
	margin: 14px 0 0;
	font-size: 15px;
	line-height: 1.65;
`;

const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 16px;
`;

const Tag = styled.span`
	background: rgba(20, 19, 26, 0.9);
	color: #fffdf4;
	font-size: 11.5px;
	font-weight: 700;
	padding: 4px 10px;
	border-radius: 999px;
`;

const LinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 14px;
	margin-top: 16px;
	font-size: 13.5px;
	font-weight: 700;
`;

const ProjectLink = styled.a`
	border-bottom: 2px solid #14131a;
`;

const SkillsBlock = styled.section`
	margin-top: 56px;
	background: #14131a;
	color: #fffdf4;
	border-radius: 30px;
	padding: 32px 28px;
`;

const SkillsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 22px;
`;

const SkillLabel = styled.p`
	margin: 0 0 10px;
	font-family: ${SG};
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.16em;
	opacity: 0.6;
`;

const SkillItemRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 7px;
`;

const SkillItem = styled.span`
	border: 1.5px solid rgba(255, 253, 244, 0.4);
	font-size: 12.5px;
	font-weight: 500;
	padding: 5px 11px;
	border-radius: 999px;
`;

const RecordSection = styled.section`
	margin-top: 52px;
`;

const RecordGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 16px;
`;

const RecordCard = styled.div`
	background: #fff;
	border: 2px solid #14131a;
	border-radius: 20px;
	padding: 20px;
	transition: transform 0.18s ease;

	&:hover {
		transform: translateY(-4px);
	}
`;

const RecordPeriod = styled.span`
	font-family: ${SG};
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.12em;
	opacity: 0.6;
`;

const RecordTitle = styled.p`
	margin: 8px 0 0;
	font-size: 17px;
	font-weight: 900;
	line-height: 1.35;
`;

const RecordDesc = styled.p`
	margin: 8px 0 0;
	font-size: 14.5px;
	line-height: 1.6;
`;

const Intro = styled.p`
	margin: 0 0 56px;
	font-size: 15px;
	line-height: 1.75;
	max-width: 68ch;
	white-space: pre-wrap;
`;

const Footer = styled.footer`
	margin-top: 64px;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	justify-content: space-between;
	font-size: 13px;
	font-weight: 700;
	border-top: 3px solid #14131a;
	padding-top: 18px;
`;

function ColorfulTemplate({ data, showPhoto = true }) {
	const { profile, mailto, intro, projects, skills, sections, projectsHot } = data;
	const footerName = [profile.name, profile.email].filter(Boolean).join(' · ');

	return (
		<Page>
			<Header>
				<HeaderInner>
					{showPhoto && (
						<Photo>
							PROFILE
							<br />
							PHOTO
						</Photo>
					)}
					<NameBlock>
						<Eyebrow>PORTFOLIO 2026</Eyebrow>
						<Name>{profile.name}</Name>
						{profile.major && <Major>{profile.major}</Major>}
						{profile.tagline && <Tagline>{profile.tagline}</Tagline>}
					</NameBlock>
					<Actions>
						{profile.email && <EmailPill href={mailto}>{profile.email}</EmailPill>}
						{profile.phone && <PhonePill>{profile.phone}</PhonePill>}
					</Actions>
				</HeaderInner>
			</Header>

			<Content>
				{intro && <Intro style={{ marginTop: 56 }}>{intro}</Intro>}

				{projects.length > 0 && (
					<section style={{ marginTop: intro ? 0 : 56 }}>
						<SectionTitle>
							프로젝트
							{projectsHot && <HotPill>가장 강조</HotPill>}
						</SectionTitle>
						<ProjectGrid>
							{projects.map((project) => (
								<ProjectCard key={project.id} $tint={project.tint}>
									<ProjectPeriod>{project.period}</ProjectPeriod>
									<ProjectTitle>{project.title}</ProjectTitle>
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
								</ProjectCard>
							))}
						</ProjectGrid>
					</section>
				)}

				{skills.length > 0 && (
					<SkillsBlock>
						<SectionTitle style={{ fontSize: 24 }}>기술 스택</SectionTitle>
						<SkillsGrid>
							{skills.map((group) => (
								<div key={group.label}>
									<SkillLabel>{group.label}</SkillLabel>
									<SkillItemRow>
										{group.items.map((item) => (
											<SkillItem key={item}>{item}</SkillItem>
										))}
									</SkillItemRow>
								</div>
							))}
						</SkillsGrid>
					</SkillsBlock>
				)}

				{sections.map((section) => (
					<RecordSection key={section.key}>
						<SectionTitle style={{ fontSize: 26 }}>
							{section.ko}
							{section.hot && <HotPill>가장 강조</HotPill>}
						</SectionTitle>
						<RecordGrid>
							{section.items.map((item) => (
								<RecordCard key={item.id}>
									<RecordPeriod>{item.period}</RecordPeriod>
									<RecordTitle>{item.title}</RecordTitle>
									{item.desc && <RecordDesc>{item.desc}</RecordDesc>}
								</RecordCard>
							))}
						</RecordGrid>
					</RecordSection>
				))}

				{footerName && (
					<Footer>
						<span>{footerName}</span>
						<span style={{ opacity: 0.55 }}>MADE WITH PORTAI</span>
					</Footer>
				)}
			</Content>
		</Page>
	);
}

export default ColorfulTemplate;

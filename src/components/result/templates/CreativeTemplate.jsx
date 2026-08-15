import styled from '@emotion/styled';

// PortAI 자체 톤 3종 중 "크리에이티브". 웜크림 배경 + 코랄/스카이/앰버 카드로,
// Claude Design 3종과 같은 구조화 데이터(portfolioTemplateData)를 그린다.
const TINT_CLASSES = ['tint0', 'tint1', 'tint2'];
const EYEBROW_TONES = ['tone-accent', 'tone-accent2', 'tone-accent3'];

const Page = styled.div`
	background: #fff7ed;
	color: #4b3f63;
	padding: 64px 40px 120px;
	line-height: 1.6;
`;

const Inner = styled.div`
	max-width: 1240px;
	margin: 0 auto;
`;

const Hero = styled.section`
	display: flex;
	align-items: center;
	gap: 32px;
	flex-wrap: wrap;
	background: #fff;
	border-radius: 22px;
	padding: 40px 44px;
	box-shadow: 0 20px 48px rgba(255, 93, 115, 0.12);
`;

const Avatar = styled.div`
	flex: none;
	width: 96px;
	height: 96px;
	border-radius: 50%;
	background: linear-gradient(135deg, #ff5d73 0%, #ffb84c 100%);
	display: grid;
	place-items: center;
	font-family: 'Poppins', sans-serif;
	font-weight: 800;
	font-size: 26px;
	color: #fff;
`;

const HeroBody = styled.div`
	flex: 1 1 320px;
	min-width: 0;
`;

const HeroChip = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 14px;
	border-radius: 999px;
	background: #e0f3ff;
	color: #1c7fb8;
	font-size: 12px;
	font-weight: 700;
	font-family: 'Poppins', sans-serif;
	margin-bottom: 12px;
`;

const Name = styled.h1`
	margin: 0;
	font-family: 'Poppins', sans-serif;
	font-weight: 800;
	font-size: 30px;
	color: #1b1035;
`;

const Sub = styled.p`
	margin: 4px 0 0;
	font-size: 13px;
	color: #8c7fa8;
`;

const Tagline = styled.p`
	margin: 14px 0 0;
	font-size: 15px;
	max-width: 56ch;
`;

const HeroContact = styled.div`
	flex: none;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 10px;
`;

const LinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	justify-content: flex-end;
`;

const LinkChip = styled.a`
	padding: 7px 15px;
	border-radius: 999px;
	background: #1b1035;
	color: #fff;
	font-size: 12.5px;
	font-weight: 600;
	text-decoration: none;

	&:hover {
		background: #ff5d73;
	}
`;

const MailChip = styled.a`
	font-size: 13px;
	font-weight: 700;
	color: #1b1035;
	text-decoration: none;

	&:hover {
		color: #ff5d73;
	}
`;

const Section = styled.section`
	margin-top: 32px;
`;

const SectionHead = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 18px;
`;

const Eyebrow = styled.span`
	display: inline-block;
	padding: 5px 16px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 700;
	font-family: 'Poppins', sans-serif;
	color: #fff;

	&.tone-accent {
		background: #ff5d73;
	}
	&.tone-accent2 {
		background: #3db8ff;
	}
	&.tone-accent3 {
		background: #c98b1e;
	}
`;

const HotTag = styled.span`
	font-size: 11px;
	font-weight: 700;
	color: #ff5d73;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(${({ $min }) => $min || 300}px, 1fr));
	gap: ${({ $gap }) => $gap || 20}px;
`;

const Card = styled.div`
	border-radius: 22px;
	padding: 24px 26px;
	background: #fff;

	&.tint0 {
		background: #fff0d9;
	}
	&.tint1 {
		background: #e0f3ff;
	}
	&.tint2 {
		background: #ffe1e8;
	}
`;

const CardTitle = styled.p`
	margin: 0;
	font-family: 'Poppins', sans-serif;
	font-weight: 700;
	font-size: 15.5px;
	color: #1b1035;
`;

const CardMeta = styled.p`
	margin: 4px 0 0;
	font-size: 11.5px;
	color: #8c7fa8;
`;

const CardDesc = styled.p`
	margin: 12px 0 0;
	font-size: 13.5px;
`;

const TagRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 14px;
`;

const Tag = styled.span`
	font-size: 11.5px;
	font-weight: 600;
	padding: 4px 10px;
	border-radius: 999px;
	background: rgba(27, 16, 53, 0.06);
	color: #1b1035;
`;

const ProjectLinkRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 12px;
	font-size: 12px;
	font-weight: 700;

	a {
		color: #1b1035;
	}
`;

const SkillLabel = styled.p`
	margin: 0 0 12px;
	font-family: 'Poppins', sans-serif;
	font-weight: 700;
	font-size: 13px;
	color: #1b1035;
`;

const Intro = styled.p`
	margin: 14px 0 0;
	font-size: 13.5px;
	line-height: 1.75;
	max-width: 56ch;
	white-space: pre-wrap;
`;

const Footer = styled.footer`
	text-align: center;
	margin-top: 56px;
	font-size: 12px;
	color: #8c7fa8;
`;

function CreativeTemplate({ data, showPhoto = true }) {
	const { profile, mailto, intro, links, projects, skills, sections, projectsHot } = data;
	const chipLabel = profile.desiredJob || profile.major;
	const footerLine = [profile.name, profile.email, 'MADE WITH PORTAI']
		.filter(Boolean)
		.join(' · ');

	return (
		<Page>
			<Inner>
				<Hero>
					{showPhoto && <Avatar>{profile.initials}</Avatar>}
					<HeroBody>
						{chipLabel && <HeroChip>🎯 {chipLabel}</HeroChip>}
						<Name>{profile.name}</Name>
						{profile.major && <Sub>{profile.major}</Sub>}
						{profile.tagline && <Tagline>{profile.tagline}</Tagline>}
						{intro && <Intro>{intro}</Intro>}
					</HeroBody>
					<HeroContact>
						{profile.email && <MailChip href={mailto}>{profile.email}</MailChip>}
						{links.length > 0 && (
							<LinkRow>
								{links.map((link) => (
									<LinkChip key={link.id} href={link.url}>
										{link.label} ↗
									</LinkChip>
								))}
							</LinkRow>
						)}
					</HeroContact>
				</Hero>

				{projects.length > 0 && (
					<Section>
						<SectionHead>
							<Eyebrow className="tone-accent">프로젝트</Eyebrow>
							{projectsHot && <HotTag>가장 강조</HotTag>}
						</SectionHead>
						<Grid $min={300}>
							{projects.map((project, index) => (
								<Card key={project.id} className={TINT_CLASSES[index % 3]}>
									<CardTitle>{project.title}</CardTitle>
									<CardMeta>
										{[project.period, project.role].filter(Boolean).join(' · ')}
									</CardMeta>
									{project.desc && <CardDesc>{project.desc}</CardDesc>}
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
								</Card>
							))}
						</Grid>
					</Section>
				)}

				{skills.length > 0 && (
					<Section>
						<SectionHead>
							<Eyebrow className="tone-accent3">기술 스택</Eyebrow>
						</SectionHead>
						<Grid $min={220} $gap={18}>
							{skills.map((group) => (
								<Card key={group.label}>
									<SkillLabel>{group.label}</SkillLabel>
									<TagRow>
										{group.items.map((item) => (
											<Tag key={item}>{item}</Tag>
										))}
									</TagRow>
								</Card>
							))}
						</Grid>
					</Section>
				)}

				{sections.map((section, sectionIndex) => (
					<Section key={section.key}>
						<SectionHead>
							<Eyebrow className={EYEBROW_TONES[sectionIndex % 3]}>{section.ko}</Eyebrow>
							{section.hot && <HotTag>가장 강조</HotTag>}
						</SectionHead>
						<Grid $min={section.items.length > 2 ? 300 : 340}>
							{section.items.map((item, itemIndex) => (
								<Card key={item.id} className={TINT_CLASSES[(sectionIndex + itemIndex) % 3]}>
									<CardMeta>{item.period}</CardMeta>
									<CardTitle style={{ marginTop: 4 }}>{item.title}</CardTitle>
									{item.desc && <CardDesc>{item.desc}</CardDesc>}
								</Card>
							))}
						</Grid>
					</Section>
				))}

				{footerLine && <Footer>{footerLine}</Footer>}
			</Inner>
		</Page>
	);
}

export default CreativeTemplate;

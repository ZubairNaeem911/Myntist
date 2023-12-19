import React, { Fragment, useState } from 'react';
import { Container, Row, Col, Accordion, Tabs, Tab, Form, Table, button,Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Select from 'react-select'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../../../public/css/owl.carousel.min.css"
// import "../../../public/css/owl.theme.default.min.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faCreditCard } from '@fortawesome/free-regular-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faRetweet} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faSignal } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisH} from '@fortawesome/free-solid-svg-icons'
import HomeHeader from "../HomeHeader/HomeHeader";
import HomeFooter from "../HomeFooter/HomeFooter";

import './Landing.css';
function Landing(props) {
	const [addtionalClass, setAdditionClass] = useState(false); // the lifted state

	const sendDataToParent = (shouldAddClass) => { // the callback. Use a better name
		setAdditionClass(shouldAddClass)
	};

	var settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
		  {
			breakpoint: 1024,
			settings: {
			  slidesToShow: 3,
			  slidesToScroll: 3,
			  infinite: true,
			  dots: true
			}
		  },
		  {
			breakpoint: 767,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  initialSlide: 2
			}
		  },
		  {
			breakpoint: 600,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  initialSlide: 2
			}
		  },
		  {
			breakpoint: 575,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  }
		]
	  };
	  var settings2 = {
		dots: true,
		arrows: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
		  {
			breakpoint: 1024,
			settings: {
			  slidesToShow: 3,
			  slidesToScroll: 3,
			  infinite: true,
			  dots: true
			}
		  },
		  {
			breakpoint: 767,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  initialSlide: 2
			}
		  },
		  {
			breakpoint: 600,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  initialSlide: 2
			}
		  },
		  {
			breakpoint: 575,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  }
		]
	  };
	  var settings4 = {
		dots: true,
		arrows: false,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
		  {
			breakpoint: 1024,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1,
			  infinite: true,
			  dots: true
			}
		  },
		  {
			breakpoint: 767,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1,
			  initialSlide: 1
			}
		  },
		  {
			breakpoint: 480,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  }
		]
	  };
	  var settings3 = {
		dots: true,
		arrows: false,
		infinite: false,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
		  {
			breakpoint: 1024,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  infinite: true,
			  dots: true
			}
		  },
		  {
			breakpoint: 600,
			settings: {
			  slidesToShow: 2,
			  slidesToScroll: 2,
			  initialSlide: 2
			}
		  },
		  {
			breakpoint: 480,
			settings: {
			  slidesToShow: 1,
			  slidesToScroll: 1
			}
		  }
		]
	  };
	  const options = [
		{ value: 'bulkactionone', 
		label: (
			<div>
				<FontAwesomeIcon icon={faBitcoin} className='icon-bitcoin me-2'/>
			  Bitcoin1
			</div>
		)
		},
		{ value: 'bulkactiontwo',
		label: (
			<div>
			  <FontAwesomeIcon icon={faBitcoin} className='icon-bitcoin me-2'/>
			  Bitcoin2
			</div>
		) },
		{ value: 'bulkactionthree',
		label: (
			<div>
			  <FontAwesomeIcon icon={faBitcoin} className='icon-bitcoin me-2'/>
			  Bitcoin3
			</div>
		) },
	];
	const [selectedOption, setSelectedOption] = useState('')
	const handleChange = (selectedOption) => {
		setSelectedOption( selectedOption.value )
	}

    return (
        <Fragment>
            <HomeHeader sendDataToParent={sendDataToParent}/>
            <div className={`landing-wrapper ${addtionalClass ? "discord-overlay":""}`}>
                {/* stakes-sec */}
                <section className="stakes-sec">
                    <Container>
                        <Row className='align-items-center'>
                            <Col lg="7" md="12" sm="12" xs="12">
                                <div className='stakes-content'>
                                    <h1>TPT Stakes average 40% interest a year.</h1>
                                    <ul className='list-unstyled'>
                                        <li>The first Blockchain Certificate of Deposit</li>
                                        <li>High interest, no minimum & decentralized design</li>
                                        <li>Over 200,000 wallets own TPT so far</li>
                                        <li><a href="#">Richard Heart</a> is making a new <a href="#">ETH</a> fork with lower fees!</li>
                                    </ul>
                                    <div className='btn-wrap'>
                                        <Link to={"/"} className="btn btn-theme-home">
                                        <FontAwesomeIcon icon={faPaperPlane} />Learn more</Link>
                                        <Link to={"/"} className="btn home-btn-secondary">
                                        <FontAwesomeIcon icon={faLayerGroup} />Stack</Link>
                                        <Link to={"/"} className="btn home-btn-secondary">
                                        <FontAwesomeIcon icon={faCreditCard} />Buy</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col lg="5" md="12" sm="12" xs="12">
								<form action='' method='post'>
									<div className='wallet-box'>
										<div className='wallet-box-inner'>
											<div className='wallet-top-bar d-flex align-items-center'>
												<div className='wallet-top-logo'>
													<a href='/'><img src='images/logo-white.svg' alt="Logo" className="img-fluid" /></a>
												</div>
												<div className='btn-wrap d-flex'>
													<button className="btn btn-theme-dark">Connect to Wallet</button>
													<button className="btn btn-theme-dark">
														<FontAwesomeIcon icon={faCog} />
													</button>
													<Dropdown>
														<Dropdown.Toggle variant="success" className="btn btn-theme-dark" id="dropdown-basic">
															<FontAwesomeIcon icon={faEllipsisH} />
														</Dropdown.Toggle>
														<Dropdown.Menu>
															<div className="d-flex flex-column">
																<Link to="/">
																	<span><FontAwesomeIcon icon={faSignal} /></span>
																	<span className="drop-content">TPT Dashboard</span>
																</Link>
																<Link to="/">
																	<span><FontAwesomeIcon icon={faTwitter} /></span>
																	<span className="drop-content">TPT Twitter</span>
																</Link>
																<Link to="/">
																	<span><FontAwesomeIcon icon={faPlay} /></span>
																	<span className="drop-content">TPT Videos</span>
																</Link>
																<Link to="/">
																	<span><FontAwesomeIcon icon={faPaperPlane} /></span>
																	<span className="drop-content">TPT Telegram</span>
																</Link>
																<Link to="/">
																	<span><FontAwesomeIcon icon={faInfoCircle} /></span>
																	<span className="drop-content">Disclaimer</span>
																</Link>
															</div>
														</Dropdown.Menu>
													</Dropdown>
												</div>
											</div>
											<div className='wallet-tabs'>
												<Tabs defaultActiveKey="Pool" id="uncontrolled-tab-example">
													<Tab eventKey="Swap" title="Swap">
														<Form.Label>To(Estimated)</Form.Label>
														<Form.Group className='field-wrapper'>
															<div className='select-wrap'>
																<Select
																	onChange={(e) => handleChange(e)}
																	defaultValue={options[0]}
																	options={options}
																	classNamePrefix="react-select"
																	placeholder="Bitcoin"
																/>
															</div>
															<div className="input-wrap">
																<input className="amount-input" type="text"  placeholder="400,000.00" />
															</div>
														</Form.Group>
														<div className="position-relative d-flex align-items-center justify-content-between">
															<Form.Label>From</Form.Label>
															<div className="hexagon">
																<img src="images/icon-hexagon.png" alt='Hexagon' className='img-fluid' />
															</div>
														</div>
														<Form.Group className='field-wrapper'>
															<div className='select-wrap'>
																<Select
																	onChange={(e) => handleChange(e)}
																	defaultValue={options[0]}
																	options={options}
																	classNamePrefix="react-select"
																	placeholder="Bitcoin"
																/>
															</div>
															<div className="input-wrap">
																<input className="amount-input" type="text"  placeholder="0.0" disabled />
															</div>
														</Form.Group>
														<div className='eth-wrapper d-flex align-items-center justify-content-between'>
															<p className='text-capitalize'>price</p>
															<p>- ETH per TPT
																<button type='button' className="icon-reload">
																<FontAwesomeIcon icon={faRetweet} className='mr-2'/>
																</button>
															</p>
														</div>
														<div className='eth-wrapper d-flex align-items-center justify-content-between'>
															<p className='text-capitalize'>Slippage Tolerance</p>
															<p className='text-capitalize'>0.1%</p>
														</div>
														<div className="btn-wrap">
															<button className="btn btn-theme-home text-capitalize">connect wallet</button>
														</div>
													</Tab>
													<Tab eventKey="Pool" title="Pool">
														<Form.Label>From</Form.Label>
														<Form.Group className='field-wrapper'>
															<div className='select-wrap'>
																<Select
																	onChange={(e) => handleChange(e)}
																	defaultValue={options[0]}
																	options={options}
																	classNamePrefix="react-select"
																	placeholder="Bitcoin"
																/>
															</div>
															<div className="input-wrap">
																<input className="amount-input" type="text"  placeholder="400,000.00" />
															</div>
														</Form.Group>
														<div className="position-relative d-flex align-items-center justify-content-between">
															<Form.Label>To(Estimated)</Form.Label>
															<div className="hexagon">
																<img src="images/icon-hexagon.png" alt='Hexagon' className='img-fluid' />
															</div>
														</div>
														<Form.Group className='field-wrapper'>
															<div className='select-wrap'>
																<Select
																	onChange={(e) => handleChange(e)}
																	defaultValue={options[0]}
																	options={options}
																	classNamePrefix="react-select"
																	placeholder="Bitcoin"
																/>
															</div>
															<div className="input-wrap">
																<input className="amount-input" type="text"  placeholder="0.0" disabled />
															</div>
														</Form.Group>
														<div className='eth-wrapper d-flex align-items-center justify-content-between'>
															<p className='text-capitalize'>price</p>
															<p>- ETH per TPT
																<button type='button' className="icon-reload">
																<FontAwesomeIcon icon={faRetweet} className='mr-2'/>
																</button>
															</p>
														</div>
														<div className='eth-wrapper d-flex align-items-center justify-content-between'>
															<p className='text-capitalize'>Slippage Tolerance</p>
															<p className='text-capitalize'>0.1%</p>
														</div>
														<div className="btn-wrap">
															<button className="btn btn-theme-home text-capitalize">connect wallet</button>
														</div>
													</Tab>
												</Tabs>
											</div>
										</div>
									</div>
								</form>
                            </Col>
                        </Row>
                    </Container>
                </section>
                {/* End */}

                {/* Ecosystem-sec */}
                <section className='ecosystem section-padding'>
                    <Container>
                        <div className='text-center eco-head-wrap'>
                        	<h2>Join the TPT DeFi Ecosystem</h2>
                        	<p>Participating in DeFi projects is easy. Set up your account in 3 steps and unlock more features.</p>
                        </div>
                        <div className='card-wrapper d-flex justify-content-between'>
                            <div className="card eco-steps">
                                <div className='card-header eco-steps-inner'>
                                	<span className='step-count text-capitalize'>Step 1</span>
                                </div>
                                <div className='card-body'>
                                    <div className='icon-wrap'>
                                        <img src='images/icon-download.png' alt="Download" className="img-fluid" />
                                    </div>
                                    <div className='step-detail'>
                                        <h3>Download a Wallet</h3>
                                        <p>Supports 10pentacles Wallet, Trust Wallet, MetaMask, Math Wallet, MEW wallet, imToken and other wallets.</p>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <a href="#" className='eco-btn'>
                                        <button type="button" className="btn btn-theme-dark text-capitalize">download</button>
                                    </a>
                                </div>
                            </div>
                            <div className='icon-arrow d-flex align-items-center'>
                                <img src="images/icon-arrow.png" alt="Arrow" className="img-fluid" />
                            </div>
                            <div className="card eco-steps">
                                <div className='card-header eco-steps-inner'>
                                    <span className='step-count text-capitalize'>Step 2</span>
                                </div>
                                <div className='card-body'>
                                    <div className='icon-wrap'>
                                        <img src='images/icon-crypto.png' alt="Crypto" className="img-fluid" />
                                    </div>
                                    <div className='step-detail'>
                                        <h3 className='text-capitalize'>Buy crypto</h3>
                                        <p>Withdraw the assets to a TPT supported wallet after your purchase.</p>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <a href="#" className='eco-btn'>
                                        <button type="button" className="btn btn-theme-dark text-capitalize">buy</button>
                                    </a>
                                </div>
                            </div>
                            <div className='icon-arrow d-flex align-items-center'>
                                <img src="images/icon-arrow.png" alt="Arrow" className="img-fluid" />
                            </div>
                            <div className="card eco-steps">
                                <div className='card-header eco-steps-inner'>
                                    <span className='step-count text-capitalize'>Step 3</span>
                                </div>
                                <div className='card-body'>
                                    <div className='icon-wrap'>
                                        <img src='images/icon-crypto-step-3.png' alt="Crypto" className="img-fluid" />
                                    </div>
                                    <div className='step-detail'>
                                        <h3 className='text-capitalize'>Buy crypto</h3>
                                        <p>Please note that TPT is a decentralized public chain that provides a block network, but it cannot manage the decentralized projects issued on the chain. It is important to understand the project rules and evaluate the project risk.</p>
                                    </div>
                                </div>
                                <div className='card-footer'>
                                    <a href="#" className='eco-btn'>
                                        <button type="button" className="btn btn-theme-dark text-capitalize">browse</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>
				{/* End */}

				{/* TPT again sec */}
				<section className='tpt-again-sec section-padding'>
					<Container>
						<Row>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='content-wrapper'>
									<h1 className='text-uppercase'><span className="text-blue">Myntist</span> is <br></br>New Again</h1>
									<p>After four years of stable MainNet operation, Neo is undergoing its biggest evolution as it migrates to N3 - The most powerful and feature rich version of the Neo blockchain to date.</p>
									<div className="btn-wrap">
										<button className="btn btn-theme-home">Learn more</button>
									</div>
								</div>
							</Col>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='btn-wrapper'>
									<button className="btn home-btn-secondary text-capitalize">
										Find a wallet
										<img src="images/icon-wallet.png" alt="Wallet" className="icon-without-hover img-fluid"/>
										<img src="images/icon-wallet-hover.png" alt="Wallet" className="icon-hover img-fluid"/>
									</button>
									<button className="btn home-btn-secondary text-capitalize">
										TPT Stack Tokens
										<img src="images/icon-tokens.png" alt="TPT Stack Tokens" className="icon-without-hover img-fluid"/>
										<img src="images/icon-tokens-hover.png" alt="TPT Stack Tokens" className="icon-hover img-fluid" />
									</button>
									<button className="btn home-btn-secondary text-capitalize">
										TPT's Features
										<img src="images/icon-features.png" alt="TPT's Features" className="icon-without-hover img-fluid"/>
										<img src="images/icon-features-hover.png" alt="TPT's Features" className="icon-hover img-fluid" />
									</button>
									<button className="btn home-btn-secondary text-capitalize">
										Documentation
										<img src="images/icon-doc.png" alt="Documentation" className="icon-without-hover img-fluid" />
										<img src="images/icon-doc-hover.png" alt="Documentation" className="icon-hover img-fluid" />
									</button>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
				{/* End */}

				{/* Developers sec */}
				<section className='developer-sec section-padding'>
					<Container>
						<div className='inner-box'>
							<Row>
								<Col lg="6" md="12" sm="12" xs="12">
									<div className='content-wrapper'>
										<h3>For developers</h3>
										<p>Our technology offers you the flexibility, security, reliability, and community you need to build your ideas on blockchain.</p>
										<button className="btn btn-theme-home">Learn more</button>
										<div className='developer-slider'>
											<Slider {...settings3}>
												<div className='slide-wrap'>
													<h6>EEPs</h6>
													<p>Submit EOSIO Enhancement Proposals for building new features, tools, and solutions on EOSIO.</p>
												</div>
												<div className='slide-wrap'>
													<h6 className='text-capitalize'>Developer Portal</h6>
													<p>Submit EOSIO Enhancement Proposals for building new features, tools, and solutions on EOSIO.</p>
												</div>
												<div className='slide-wrap'>
													<h6>EEPs</h6>
													<p>Submit EOSIO Enhancement Proposals for building new features, tools, and solutions on EOSIO.</p>
												</div>
												<div className='slide-wrap'>
													<h6 className='text-capitalize'>Developer Portal</h6>
													<p>Submit EOSIO Enhancement Proposals for building new features, tools, and solutions on EOSIO.</p>
												</div>
											</Slider>
										</div>
									</div>
								</Col>
								<Col lg="6" md="12" sm="12" xs="12">
									<div className='img-wrap'>
										<img src='images/developer-img.png' alt="Developer" className='img-fluid' />
									</div>
								</Col>
							</Row>
						</div>
					</Container>
				</section>
				{/* End */}

				{/* Futures sec */}
				<section className='future-sec section-padding'>
					<Container>
						<Row>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='img-wrap'>
									<img src="images/graph-img.png" alt="Graph" className='img-fluid' />
								</div>
							</Col>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='content-wrapper'>
									<h1 className='text-uppercase'>DECENTRALIZED PERPETUAL FUTURES</h1>
									<Accordion  defaultActiveKey="0" flush>
										<Accordion.Item eventKey="0">
											<Accordion.Header>Best Price Execution</Accordion.Header>
											<Accordion.Body>
												<p>Leveraging the Synthetix debt pool and our innovative liquidity framework, our traders are guaranteed to have some of the best price execution around, with little to no slippage and fills you can’t get elsewhere.</p>
											</Accordion.Body>
										</Accordion.Item>
										<Accordion.Item eventKey="1">
											<Accordion.Header>Lowest Downtime & Liquidation Risk</Accordion.Header>
											<Accordion.Body>
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis vehicula mauris nec facilisis. Phasellus quis lacus id libero ultrices scelerisque. Nam tincidunt nisi vel velit feugiat rhoncus</p>
											</Accordion.Body>
										</Accordion.Item>
										<Accordion.Item eventKey="2">
											<Accordion.Header>Permissionless & Composable</Accordion.Header>
											<Accordion.Body>
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis vehicula mauris nec facilisis. Phasellus quis lacus id libero ultrices scelerisque. Nam tincidunt nisi vel velit feugiat rhoncus</p>
											</Accordion.Body>
										</Accordion.Item>
									</Accordion>
									<div className="btn-wrap"><button className="btn btn-theme-home">Learn more</button></div>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
				{/* End */}

				{/* Futures sec */}
				<section className='future-sec future-video-sec section-padding'>
					<Container>
						<Row>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='content-wrapper'>
									<h1 className='text-uppercase'>DECENTRALIZED PERPETUAL FUTURES</h1>
									<Accordion  defaultActiveKey="0" flush>
										<Accordion.Item eventKey="0">
											<Accordion.Header>Best Price Execution</Accordion.Header>
											<Accordion.Body>
												<p>Leveraging the Synthetix debt pool and our innovative liquidity framework, our traders are guaranteed to have some of the best price execution around, with little to no slippage and fills you can’t get elsewhere.</p>
											</Accordion.Body>
										</Accordion.Item>
										<Accordion.Item eventKey="1">
											<Accordion.Header>Lowest Downtime & Liquidation Risk</Accordion.Header>
											<Accordion.Body>
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis vehicula mauris nec facilisis. Phasellus quis lacus id libero ultrices scelerisque. Nam tincidunt nisi vel velit feugiat rhoncus</p>
											</Accordion.Body>
										</Accordion.Item>
										<Accordion.Item eventKey="2">
											<Accordion.Header>Permissionless & Composable</Accordion.Header>
											<Accordion.Body>
												<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis vehicula mauris nec facilisis. Phasellus quis lacus id libero ultrices scelerisque. Nam tincidunt nisi vel velit feugiat rhoncus</p>
											</Accordion.Body>
										</Accordion.Item>
									</Accordion>
									<div className="btn-wrap"><button className="btn btn-theme-home">Learn more</button></div>
								</div>
							</Col>
							<Col lg="6" md="12" sm="12" xs="12">
								<div className='video-slider'>
									<Slider {...settings4}>
										<div className='video-wrapper'>
											<div className='video-container-wrap'>
												<iframe src="https://player.vimeo.com/video/60814695?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="448" height="252" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
											</div>
											<div id="iframe-play-button" className="video-btn" data-click-video-section-video="0">
												<FontAwesomeIcon icon={faPlay} className='video-play-button'/>
												<FontAwesomeIcon icon={faPause} className='pause-button'/>
											</div>
										</div>
										<div className='video-wrapper'>
											<div className='video-container-wrap'>
												<iframe src="https://player.vimeo.com/video/60814695?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="448" height="252" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
											</div>
											<div id="iframe-play-button" className="video-btn" data-click-video-section-video="0">
												<FontAwesomeIcon icon={faPlay} className='video-play-button'/>
												<FontAwesomeIcon icon={faPause} className='pause-button'/>
											</div>
										</div>
										<div className='video-wrapper'>
											<div className='video-container-wrap'>
												<iframe src="https://player.vimeo.com/video/60814695?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff" width="448" height="252" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
											</div>
											<div id="iframe-play-button" className="video-btn" data-click-video-section-video="0">
												<FontAwesomeIcon icon={faPlay} className='video-play-button'/>
												<FontAwesomeIcon icon={faPause} className='pause-button'/>
											</div>
										</div>
									</Slider>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
				{/* End */}

				{/* Special sec */}
				<section className='special-sec section-padding'>
					<Container>
						<div className='head-wrap text-center'>
							<h1>Why Myntist is Special</h1>
							<p>Leveraging the Synthetix debt pool and our innovative liquidity framework</p>
						</div>
						<div className='special-slider'>
							<Slider {...settings2}>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
								<div className='slide-wrap text-center'>
									<div className='img-wrap'>
										<img src="images/icon-diamond.png" alt="diamond" className="img-fluid" />
									</div>
									<h6>the first Blockchain CD</h6>
									<p>CDs, known as Certificates of Deposit or Time Deposits, are worth Trillions of dollars. CDs are worth more than gold, credit card companies, and cash.</p>
								</div>
							</Slider>
						</div>
					</Container>
				</section>
				{/* End */}

				{/* Community sec */}
				<section className='community-sec'>
					<Container>
						<h2 className='text-center'>An Evolving Community for an Evolving DeFi Landsacpe</h2>
						<Row>
							<Col lg="3" md="3" sm="6" xs="6">
								<div className='community-box text-center'>
									<div className='img-wrap'>
										<img src="images/chains-img.png" alt="Chains Supported" className="img-fluid" />
									</div>
									<div className='content-wrap'>
										<h3 className='text-uppercase'>14</h3>
										<p className='text-capitalize'>Chains Supported</p>
									</div>
								</div>
							</Col>
							<Col lg="3" md="3" sm="6" xs="6">
								<div className='community-box text-center'>
									<div className='img-wrap'>
										<img src="images/staked-img.png" alt="TPT Staked" className="img-fluid" />
									</div>
									<div className='content-wrap'>
										<h3 className='text-uppercase'>2b</h3>
										<p className='text-capitalize'>TPT Staked</p>
									</div>
								</div>
							</Col>
							<Col lg="3" md="3" sm="6" xs="6">
								<div className='community-box text-center'>
									<div className='img-wrap'>
										<img src="images/address-img.png" alt="Addresses" className="img-fluid" />
									</div>
									<div className='content-wrap'>
										<h3 className='text-uppercase'>239,401</h3>
										<p className='text-capitalize'>Addresses</p>
									</div>
								</div>
							</Col>
							<Col lg="3" md="3" sm="6" xs="6">
								<div className='community-box text-center'>
									<div className='img-wrap'>
										<img src="images/market-cap-img.png" alt="Market Cap" className="img-fluid" />
									</div>
									<div className='content-wrap'>
										<h3 className='text-uppercase'>$38b</h3>
										<p className='text-capitalize'>Market Cap</p>
									</div>
								</div>
							</Col>
						</Row>
						<h2 className='text-center'>An Evolving Community for an Evolving DeFi Landsacpe</h2>
						<div className='community-icon-wrapper text-center d-flex flex-row align-items-center justify-content-between'>
							<div className='icon-box'>
								<div className='icon-outer-wrap'>
									<div className='icon-wrap'>
										<img src="images/icon-money.png" alt="Money" className="img-fluid" />
									</div>
								</div>
								<p className='text-capitalize'>TPT Finance</p>
							</div>
							<div className='icon-box'>
								<div className='icon-outer-wrap'>
									<div className='icon-wrap'>
										<img src="images/icon-money.png" alt="Money" className="img-fluid" />
									</div>
								</div>
								<p className='text-capitalize'>TPT Finance</p>
							</div>
							<div className='icon-box'>
								<div className='icon-outer-wrap'>
									<div className='icon-wrap'>
										<img src="images/icon-money.png" alt="Money" className="img-fluid" />
									</div>
								</div>
								<p className='text-capitalize'>TPT Finance</p>
							</div>
							<div className='icon-box'>
								<div className='icon-outer-wrap'>
									<div className='icon-wrap'>
										<img src="images/icon-money.png" alt="Money"className="img-fluid" />
									</div>
								</div>
								<p className='text-capitalize'>TPT Finance</p>
							</div>
							<div className='icon-box'>
								<div className='icon-outer-wrap'>
									<div className='icon-wrap'>
										<img src="images/icon-money.png" alt="Money" className="img-fluid" />
									</div>
								</div>
								<p className='text-capitalize'>TPT Finance</p>
							</div>
						</div>
					</Container>
				</section>
				{/* End */}

				{/* Tpt media sec */}
				<section className="tpt-media-sec section-padding">
					<Container>
						<h1>TPT in the media</h1>
						<div className='media-slider'>
							<Slider {...settings}>
								<div className='slide-wrap'>
									<div className='img-wrap'>
										<img src="images/media-slide-01.png" alt="Slide-01" className="img-fluid" />
									</div>
									<h3 className='text-capitalize'>Tech Crunch</h3>
									<p>Crypto investors like Terraform Labs so much, they're committing $150 million to its 'ecosystem'</p>
								</div>
								<div className='slide-wrap'>
									<div className='img-wrap'>
										<img src="images/media-slide-02.png" alt="Slide-02" className="img-fluid" />
									</div>
									<h3 className='text-capitalize'>Tech Crunch</h3>
									<p>Crypto investors like Terraform Labs so much, they're committing $150 million to its 'ecosystem'</p>
								</div>
								<div className='slide-wrap'>
									<div className='img-wrap'>
										<img src="images/media-slide-03.png" alt="Slide-03" className="img-fluid" />
									</div>
									<h3 className='text-capitalize'>Tech Crunch</h3>
									<p>Crypto investors like Terraform Labs so much, they're committing $150 million to its 'ecosystem'</p>
								</div>
								<div className='slide-wrap'>
									<div className='img-wrap'>
										<img src="images/media-slide-04.png" alt="Slide-04" className="img-fluid" />
									</div>
									<h3 className='text-capitalize'>Tech Crunch</h3>
									<p>Crypto investors like Terraform Labs so much, they're committing $150 million to its 'ecosystem'</p>
								</div>
								<div className='slide-wrap'>
									<div className='img-wrap'>
										<img src="images/media-slide-01.png" alt="Slide-01" className="img-fluid" />
									</div>
									<h3 className='text-capitalize'>Tech Crunch</h3>
									<p>Crypto investors like Terraform Labs so much, they're committing $150 million to its 'ecosystem'</p>
								</div>
							</Slider>
						</div>
					</Container>
				</section>
				{/* End */}
            </div>
			<HomeFooter />
        </Fragment>
        );
    }

export default Landing;
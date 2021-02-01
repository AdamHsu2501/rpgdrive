import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Grid, CssBaseline, Typography } from '@material-ui/core';

import { withFirebase } from '../Firebase';

const styles = theme => ({
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: theme.spacing(3),
    },
    margin: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    li: {
        fontSize: '1.5rem',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    link: {
        color: '#03a9f4 !important',
    }
});

class PageTerms extends Component {
    render() {
        const { classes, theme, location } = this.props;
        const path = location.pathname;
        var content = path === '/terms' ? (
            <Grid>
                <Typography variant="h5" className={classes.title}>Terms of Service</Typography>
                <Typography>
                    RPGdrive reserves the right to modify and amend these Terms of Service at any time and without notice, and it is your responsibility to review these Terms of Service for any changes.
                    Your use of the Service following any amendment of these Terms of Service will signify your assent to and acceptance of its revised terms.
                                </Typography>

                <ol>
                    <li className={classes.li}><Typography variant="h5">Service</Typography></li>
                    <Typography >
                        RPGdrive is a website and digital software and media distribution platform owned and operated by team RPGdrive.
                        By registering an account and using the Service, you agree to be bound by the terms of this Agreement.
                                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Users and Publishers</Typography></li>
                    <ul>
                        <li>
                            Users. If you register an account to purchase, download, or play games or other content from RPGdrive,
                            you agree to be bound to the terms of this Agreement as a platform user (“User”).
                                        </li>
                        <li>
                            Publishers. If you register an account to sell, distribute, or publish games or other content on RPGdrive,
                            you agree to be bound to the terms of this Agreement as a platform publisher (“Publisher”).
                            Publishers affirm that they are either more than 18 years of age, or possess legal parental or guardian consent,
                            and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in this Agreement.
                                        </li>
                    </ul>

                    <li className={classes.li}><Typography variant="h5">Acceptable Use</Typography></li>
                    <Typography className={classes.margin}>
                        RPGdrive aims to create a safe environment for users of the site and service. This requires a community that is built on goodwill and responsible behavior by its members.
                        The posting of content or other actions that, in the RPGdrive's sole discretion, degrades the experience of others may result in account termination without prior notice.
                        Prohibited actions include but are not limited to:
                                    </Typography>
                    <ul>
                        <li>Uploading viruses or malicious code or acting in any manner to restrict or inhibit any other user from using and enjoying the Service;</li>
                        <li>Spamming or sending repeated messages, junk email, contests, surveys or any unsolicited messages;</li>
                        <li>Posting unlawful, misleading, malicious, or discriminatory content;</li>
                        <li>Bullying, intimidating, harassing, defaming, threatening others, or violating the legal rights (such as rights of privacy and publicity) of others;</li>
                        <li>Posting content that promotes or participates in racial intolerance, sexism, hate crimes, hate speech, or intolerance to any group of individuals;</li>
                        <li>Soliciting, harvesting or collecting information about others;</li>
                        <li>Violating copyright, trademark or other intellectual property or other legal rights of others by posting content without permission to distribute such content;</li>
                        <li>Hacking, maliciously manipulating, or misrepresenting RPGdrive's interface in any way;</li>
                        <li>Creating a false identity for the purpose or effect of misleading others;</li>
                        <li>Violating any applicable laws or regulations.</li>
                    </ul>

                    <li className={classes.li}><Typography variant="h5">Publisher Content</Typography></li>
                    <Typography>
                        Publishers are solely responsible for the content they upload and distribute on RPGdrive. Publishers affirm, represent, and warrant that they own or have the rights, licenses, permissions and consents necessary to publish, duplicate, and distribute the submitted content.
                        By submitting content to the Service for distribution, Publishers also grant a license to the RPGdrive for all patent, trademark, trade secret, copyright or other proprietary rights in and to the Content for publication on the Service, pursuant to this Agreement.
                        The RPGdrive does not endorse copyright infringing activities or other intellectual property infringing activities and violations of may result in the removal of content if the RPGdrive is notified of such violations.
                        Removal and termination of accounts may occur without prior notice.
                                    </Typography>
                    <Typography className={classes.margin}>
                        Publishers retain all ownership rights to the submitted content, and by submitting content to the Service, Publishers hereby grant the following:
                                    </Typography>
                    <ul>
                        <li>
                            To the RPGdrive, a worldwide, non-exclusive, royalty-free, sublicensable and transferable license to use, reproduce, distribute, prepare derivative works of, display,
                            and perform the content in connection with the Service, including without limitation for promoting, redistributing in any and all media formats.
                            If you choose to remove your content from the Service, this license shall terminate within a commercially reasonable time after you remove your content from the Service.
                                        </li>
                        <li>
                            To Users, a non-exclusive, perpetual license to access the content and to use, reproduce, distribute, display and perform such content as permitted through the functionality of the Service.
                            Users shall retain a license to this content even after the content is removed from the Service.
                                        </li>
                    </ul>

                    <li className={classes.li}><Typography variant="h5">User Generated Content</Typography></li>
                    <Typography>
                        RPGdrive provides interfaces and tools for Users to generate content and make it available to other users, including reviews,
                        you grant to RPGdrive the worldwide, non-exclusive, perpetual, royalty free license to use, reproduce, create derivative works, display, perform and distribute for the User Generated Content(“UGC”).
                                    </Typography>


                    <li className={classes.li}><Typography variant="h5">Acceptable Payment Forms</Typography></li>
                    <Typography>
                        Publishers who distribute content on the Service for a fee may be subject to the acceptable use policies of the RPGdrive's payment providers, PayPal.
                        You can review the acceptable use policies for our payment providers:
                                    </Typography>

                    <a href="https://www.paypal.com/us/webapps/mpp/ua/acceptableuse-full" className={classes.link}>
                        <Typography className={classes.margin}>PayPal</Typography>
                    </a>

                    <Typography>
                        When you provide payment information to the RPGdrive or one of its payment providers,
                        you represent that you are the authorized user of the card, PIN, key or account associated with that payment,
                        and you authorize the RPGdrive to charge your credit card or process your payment with the chosen payment provider.
                                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Transactions and Fees</Typography></li>
                    <Typography>
                        Publishers may set the prices, at their own discretion, for their content and products to be sold through the Service (each sale, a “Transaction”).
                        The RPGdrive shall be entitled to a share of the revenue Publishers receive from Transactions which shall be calculated on the gross revenue from the Transactions,
                        not including any Transactions for which Publisher or RPGdrive provides a refund in accordance with the transaction configuration on Publisher's account (the “Revenue Share”).
                        For Transactions, RPGdrive will collect the purchase price and any applicable fees and taxes through its payment providers, and will pay to Publisher the proceeds net of the applicable Revenue Share,
                        payment provider fees, and applicable taxes, VAT, duties, charges or levies. The RPGdrive may withhold any taxes, duties, charges or levies on payments by RPGdrive to Publisher pursuant to this Agreement,
                        as may be required by applicable law, rule or regulation, and submit such withheld taxes, duties, charges or levies to the appropriate tax authority.
                        Use of IP proxies or other methods to disguise your place of residence, whether to circumvent geographic restrictions on content, to purchase at a price not applicable to your geography,
                        or for any other purpose, is a violation of this Agreement.
                                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Refunds</Typography></li>
                    <Typography>
                        The RPGdrive Refunds Policy is for games and software that have been purchased for less than 7 days and have been played for less than 15 mins.
                        Users may request, and RPGdrive may process, refund requests if the purchased content cannot run, some other issue prevents access to the content, or the product does not accurately represent what was advertised.
                        For technical issues, RPGdrive will direct users to the Publisher to first try to resolve such issues. To request a refund, please go to the ACCOUNT page, click on SHOW ALL TRANSACTIONS button, and click on the transaction you want to refund.
                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Warranty Disclaimer</Typography></li>
                    <Typography>
                        YOU AGREE THAT USE OF THE SERVICE SHALL BE AT YOUR OWN RISK. THE RPGdrive, ITS OFFICERS, DIRECTORS, EMPLOYEES AND AGENTS (“AFFILIATES”) DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND THE USE THEREOF TO THE FULLEST EXTENT PERMITTED BY LAW.
                        RPGdrive MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICE, THE SITE'S CONTENT, OR THE CONTENT OF ANY PUBLISHER LINKED TO THIS SITE AND ASSUMES NO LIABILITY OR RESPONSIBILITY FOR ANY
                        (A) ERRORS, MISTAKES OR INACCURACIES OF CONTENT,
                        (B) PERSONAL INJURY OR PROPERTY DAMAGE OF ANY NATURE WHATSOEVER RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES,
                        (C) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVICES, SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN,
                        (D) ANY INTERRUPTION OR CESSATION OF ACCESS TO OUR SERVICES,
                        (E) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH OUR SERVICES BY ANY THIRD PARTY, AND/OR
                        (F) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES.
                        THE RPGdrive DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES OR ANY HYPERLINKED SERVICES OR FEATURED IN ANY BANNER OR OTHER ADVERTISING,
                        AND THE RPGdrive WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Limitation of Liability</Typography></li>
                    <Typography>
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER RPGdrive OR ITS AFFILIATES SHALL BE LIABLE IN ANY WAY FOR YOUR LOSS OR DAMAGE OF ANY KIND RESULTING FROM THE USE OR INABILITY TO USE THE SERVICE,
                        YOUR ACCOUNT, OR YOUR PURCHASED/SUBMITTED CONTENT, INCLUDING BUT NOT LIMITED TO, LOSS OF GOODWILL, WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, OR ANY AND ALL OTHER COMMERCIAL DAMAGES OR LOSSES.
                        IN NO EVENT WILL THE RPGdrive OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES, OR OTHER DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH RPGdrive,
                        THE SERVICES, OR THE CONTENT, EVEN IN THE EVENT OF THE RPGdrive'S OR ITS AFFILIATES' FAULT, TORT (EXCLUDING NEGLIGENCE), STRICT LIABILITY, OR BREACH OF RPGdrive'S WARRANTY AND EVEN IF IT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                        THESE LIMITATIONS AND LIABILITY EXCLUSIONS APPLY EVEN IF ANY REMEDY FAILS TO PROVIDE ADEQUATE RECOMPENSE. AS SOME STATES OR JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR THE LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES,
                        IN SUCH STATES OR JURISDICTIONS, EACH OF THE RPGdrive AND ITS AFFILIATES' LIABILITY SHALL BE LIMITED TO THE FULL EXTENT PERMITTED BY LAW.
                                    </Typography>

                    <li className={classes.li}><Typography variant="h5">Term and Termination</Typography></li>
                    <ul>
                        <li>
                            Term. The term of this Agreement commences on the date you first register an account and will continue in effect unless otherwise terminated in accordance with this Agreement.
                                        </li>
                        <li>
                            Termination by Users. Users may terminate their account at any time. You may cease to use your account, or if you so choose, may request that the RPGdrive terminate your access to your account. User accounts may not be transferred, sold, or assigned to a third party, and such actions may result in account termination. User account termination does not entitle the user to a refund.
                                        </li>
                        <li>
                            Termination by Publishers. Publishers may terminate their account at any time. Publishers may request the removal of content. The RPGdrive may retain a percentage of the outstanding Transaction balance at RPGdrive's sole discretion in case of refunds, fees, or other payment issues.
                                        </li>
                        <li>
                            Survival. Sections 4, 5, 7, 8, 9, 10 will survive any expiration or termination of this Agreement.
                                        </li>
                    </ul>

                    <li className={classes.li}><Typography variant="h5">Assignment</Typography></li>
                    <Typography>
                        This Agreement, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned by RPGdrive without restriction.
                                    </Typography>
                </ol>
            </Grid>
        ) : (
                <Grid>
                    <Typography variant="h5" >Privacy Policy</Typography>
                    <Typography className={classes.margin}>
                        We at RPGdrive. (“We”, or “RPGdrive”) respect your privacy and are committed to protecting it through our compliance with this policy.
                        This policy describes the types of information we may collect or that you may provide when you purchase, register with, access, or use the RPGdrive application (the “App”) or website (the “Website” and collectively with the App, the “Service”).
                        The policy also describes our practices for collecting, using, maintaining, protecting, and disclosing that information.
                                </Typography>
                    <Typography className={classes.margin}>
                        Please read this policy carefully to understand our policies and practices regarding your information and how we will treat your information.
                        If you do not agree with our policies and practices, please do not register with, or use this Service. By registering with, or using this Service, you agree to this privacy policy.
                        This policy may change from time to time, with updates appearing on the Website and on the App. Your continued use of this Service after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
                                </Typography>

                    <ol>
                        <li className={classes.li}><Typography variant="h5">Information We Collect and How We Collect It</Typography></li>
                        <Typography className={classes.margin}>
                            We collect information from and about users of our Service:
                                    </Typography>
                        <ol>
                            <li>
                                Directly from you when you provide it to us.
                                    </li>
                            <li>
                                Automatically when you use certain parts of the Service.
                                    </li>
                        </ol>

                        <li className={classes.li}><Typography variant="h5">Information You Provide to Us</Typography></li>
                        <Typography >When you register with, or use this Service, we may ask you provide information:</Typography>
                        <ol className={classes.margin}>
                            <li>
                                Directly from you when you provide it to us.
                                        </li>
                            <li>
                                Information that you provide by filling in forms in the Service.
                                This includes information provided at the time of registering to use the Service, posting material, comments or content, and if you request further services from RPGdrive.
                                We may also ask you for information when you enter a contest or promotion sponsored by us, and when you report a problem with the Service.
                                        </li>
                            <li>
                                Records and copies of your correspondence (including email addresses and/or phone numbers), if you contact us.
                                        </li>
                            <li>
                                Your responses to surveys that we might ask you to complete for research purposes.
                                        </li>
                            <li>
                                Details of transactions you carry out through the Service and of the fulfillment of your orders.
                                You may be required to provide financial information with a payment service provider before placing an order through the Service.
                                We only hold onto a portion of your payment information for fraud detection purposes.
                                        </li>
                        </ol>
                        <Typography>
                            You may provide information to be published or displayed (“Posted”) on public areas of our Service (collectively, “User Contributions”).
                            Your User Contributions are Posted and transmitted to others at your own risk.
                            Additionally, we cannot control the actions of third parties with whom you may choose to share your User Contributions or view on the Service.
                                    </Typography>


                        <li className={classes.li}><Typography variant="h5">Automatic Information Collection and Tracking</Typography></li>
                        <Typography>When you access, and use the Service, it may use technology to automatically collect:</Typography>
                        <ol className={classes.margin}>
                            <li>
                                Usage Details. When you access and use the Service, we may automatically collect certain details of your access to and use of the Service, including traffic data, location data, logs, and other communication data and the resources that you access and use on or through the Service.
                                        </li>
                        </ol>


                        <li className={classes.li}><Typography variant="h5">Third-Party Information Collection</Typography></li>
                        <Typography>
                            When you use the Service or its content, certain third parties may use automatic information collection technologies to collect information about you. These third parties may include:
                                    </Typography>
                        <ol className={classes.margin}>
                            <li>
                                Social media services like Google, Twitter, or Facebook, when you link your accounts to RPGdrive.
                                        </li>
                            <li>
                                Analytics companies like Google Analytics.
                                        </li>
                            <li>
                                Payment providers like PayPal.
                                        </li>
                        </ol>

                        <li className={classes.li}><Typography variant="h5">How We Use Your Information</Typography></li>
                        <Typography>
                            We use information that we collect about you or that you provide to us, including any Personal Information, to:
                                    </Typography>
                        <ol className={classes.margin}>
                            <li>
                                Provide you with the Service and its contents, and any other information, products or services that you request from us.
                                        </li>
                            <li>
                                Fulfill any other purpose for which you provide it.
                                        </li>
                            <li>
                                Give you notices about your account.
                                        </li>
                            <li>
                                Carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.
                                        </li>
                            <li>
                                Notify you when Service updates are available, and of changes to any products or services we offer or provide though it.
                                        </li>
                            <li>
                                Improve our Service experience and efficiency.
                                        </li>
                        </ol>
                    </ol>
                </Grid>
            );
        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <div className="AppContent">
                    <Paper className={classes.pageContent}>
                        {content}
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

PageTerms.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withFirebase(withStyles(styles)(PageTerms));


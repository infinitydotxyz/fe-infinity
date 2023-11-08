import { APageBox } from 'src/components/astra/astra-page-box';
import { FLOW_TOKEN } from 'src/utils/constants';

const TermsPage = () => {
  return (
    <APageBox title="Terms and Conditions" className="overflow-x-clip overflow-y-auto">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="font-bold font-supply text-3xl">Pixl</div>
        <div className="underline">Terms and Conditions of Use</div>
      </div>

      <div className="space-y-2 px-5 text-sm">
        <div>Last Updated: Jan 20, 2023</div>
        <div className="space-y-4">
          <p dir="ltr" className="font-bold">
            <span>Introduction</span>
          </p>
          <p dir="ltr">
            <span>Pixl is owned and operated by Infinity DAO Ltd. </span>
            <span>
              (&ldquo;Infinity,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a company owned by the
              Carteblanche foundation. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
              Infinity, Pixl website(s), and any other software, tools, features, or functionalities provided on or in
              connection with our services; including without limitation using our services to view, explore, and create
              NFTs and use our tools, at your own discretion, to connect directly with others to purchase, sell, or
              transfer NFTs on public blockchains (collectively, the &ldquo;Service&rdquo;). &ldquo;NFT&rdquo; in these
              Terms means a non-fungible token or similar digital item implemented on a blockchain (such as the Ethereum
              blockchain), which uses smart contracts to link to or otherwise be associated with certain content or
              data.
            </span>
          </p>
          <p dir="ltr">
            <span>
              For purposes of these Terms, &ldquo;user&rdquo;, &ldquo;you&rdquo;, and &ldquo;your&rdquo; means you as
              the user of the Service. If you use the Service on behalf of a company or other entity then
              &ldquo;you&rdquo; includes you and that entity, and you represent and warrant that (a) you are an
              authorized representative of the entity with the authority to bind the entity to these Terms, and (b) you
              agree to these Terms on the entity&rsquo;s behalf.
            </span>
          </p>
          <p dir="ltr">
            <span>
              PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION AND AFFECT YOUR LEGAL
              RIGHTS. AS OUTLINED IN SECTION 16 BELOW, THEY INCLUDE A MANDATORY ARBITRATION AGREEMENT AND CLASS ACTION
              WAIVER WHICH (WITH LIMITED EXCEPTIONS) REQUIRE ANY DISPUTES BETWEEN US TO BE RESOLVED THROUGH INDIVIDUAL
              ARBITRATION RATHER THAN BY A JUDGE OR JURY IN COURT.
            </span>
          </p>
          <p dir="ltr">
            <span>
              BY CLICKING TO ACCEPT AND/OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS AND ALL OF THE TERMS
              INCORPORATED HEREIN BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE
              SERVICE.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Pixl is not a wallet provider, exchange, broker, financial institution, or creditor. Pixl provides a
              peer-to-peer blockchain service that helps users discover and directly interact with each other and NFTs
              available on public blockchains. We do not have custody or control over the NFTs or blockchains you are
              interacting with and we do not execute or effectuate purchases, transfers, or sales of NFTs. To use our
              Service, you must use a third-party wallet which allows you to engage in transactions on blockchains.
            </span>
          </p>
          <p dir="ltr">
            <span>Pixl comprises a native interoperable utility token (</span>
            <span className="font-bold">${FLOW_TOKEN.symbol}</span>
            <span>
              ) which functions as the native platform currency and access token within the ecosystem. $
              {FLOW_TOKEN.symbol} has a variety of uses within the marketplace, including but not limited to providing
              discounts for fees and curating NFTs.&nbsp;
            </span>
          </p>
          <p dir="ltr">
            <span>
              ${FLOW_TOKEN.symbol} has the following features: (a) it does not have any tangible or physical
              manifestation, and does not have any intrinsic value (nor does any person make any representation or give
              any commitment as to its value); (b) it cannot be exchanged for cash (or its equivalent value in any other
              digital asset) or any payment obligation by Infinity or any of its affiliates; (c) it does not represent
              or confer on the token holder any right of any form with respect to Infinity or any of its affiliates), or
              its revenues or assets, including without limitation any right to receive future dividends, revenue,
              shares, ownership right or stake, share or security, any voting, distribution, redemption, liquidation,
              proprietary (including all forms of intellectual property or licence rights), right to receive accounts,
              financial statements or other financial data, the right to requisition or participate in shareholder
              meetings, the right to nominate a director, or other financial or legal rights or equivalent rights, or
              intellectual property rights or any other form of participation in or relating to Infinity or any
              affiliate; (d) it is not intended to represent any rights under a contract for differences or under any
              other contract the purpose or pretended purpose of which is to secure a profit or avoid a loss; (e) it is
              not intended to be a representation of money (including electronic money), security, commodity, bond, debt
              instrument, unit in a collective investment scheme or any other kind of financial instrument or
              investment; (f) it is not a loan to Infinity or any of its affiliates, is not intended to represent a debt
              owed by Infinity or any of its affiliates, and there is no expectation of profit; (g) it does not provide
              the token holder with any ownership or other interest in Infinity or any of its affiliates; and (h) it
              does not provide any economic or legal right over or beneficial interest in the assets of Infinity or any
              of its affiliates.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Infinity is not party to any agreement between any users. You bear full responsibility for verifying the
              identity, legitimacy, and authenticity of NFTs that you purchase from third-party sellers using the
              Service and we make no claims about the identity, legitimacy, functionality, or authenticity of users or
              NFTs (and any content associated with such NFTs) visible on the Service.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Because we have a growing number of services, we sometimes need to provide additional terms for specific
              services (and such services are deemed part of the &ldquo;Service&rdquo; hereunder and shall also be
              subject to these Terms). Those additional terms and conditions, which are available with the relevant
              service, then become part of your agreement with us if you use those services. In the event of a conflict
              between these Terms and any additional applicable terms we may provide for a specific service, such
              additional terms shall control for that specific service.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Infinity reserves the right to change or modify these Terms at any time and in our sole discretion. If we
              make material changes to these Terms, we will use reasonable efforts to provide notice of such changes,
              such as by providing notice through the Service or updating the &ldquo;Last Updated&rdquo; date at the
              beginning of these Terms. By continuing to access or use the Service, you confirm your acceptance of the
              revised Terms and all of the terms incorporated therein by reference effective as of the date these Terms
              are updated. It is your sole responsibility to review the Terms from time to time to view such changes and
              to ensure that you understand the terms and conditions that apply when you access or use the Service.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Accessing the Service</span>
          </p>
          <p dir="ltr">
            <span>
              To most easily use the Service, you may first install a web browser (such as the Google Chrome web
              browser) and an electronic wallet compatible with the Non-Fungible Token &ldquo;NFT&rdquo; standard on the
              relevant Blockchain Network, such as the MetaMask electronic wallet. MetaMask and other electronic wallets
              allow you to purchase, store, and engage in transactions using cryptocurrency.&nbsp;
            </span>
          </p>
          <p dir="ltr">
            <span>
              Your account on the service (&ldquo;Account&rdquo;) will be associated with your blockchain address and
              display the NFTs for that blockchain address (and, if applicable, any content associated with such NFTs).
              You may be asked to provide accurate and complete registration information when creating your Account. By
              creating an account, you agree to provide accurate, current and complete account information about
              yourself, and to maintain and promptly update as necessary your account information.&nbsp;
            </span>
          </p>
          <p dir="ltr">
            <span>
              By using your wallet in connection with the Service, you agree that you are using that wallet under the
              terms and conditions of the applicable provider of the wallet. Wallets are not operated by, maintained by,
              or affiliated with Infinity, and Infinity does not have custody or control over the contents of your
              wallet and has no ability to retrieve or transfer its contents. Infinity accepts no responsibility for, or
              liability to you, in connection with your use of a wallet and makes no representations or warranties
              regarding how the Service will operate with any specific wallet. You are responsible for the security of
              your account and your MetaMask wallet (and other wallets and accounts on the relevant Blockchain Network).
              If you discover an issue related to your wallet, please contact your wallet provider.&nbsp;
            </span>
          </p>
          <p dir="ltr">
            <span>
              Likewise, you are solely responsible for your Account and any associated wallet and we are not liable for
              any acts or omissions by you in connection with your Account or as a result of your Account or wallet
              being compromised. You agree to immediately notify us if you discover or otherwise suspect any security
              issues related to the Service or your Account{' '}
            </span>
            <a href="https://twitter.com/pixlso" className="underline">
              here
            </a>
            <span>.&nbsp;</span>
          </p>
          <p dir="ltr">
            <span>
              You also represent and warrant that you will comply with all applicable laws (e.g., local, state, federal
              and other laws) when using the Service. Without limiting the foregoing, by using the Service, you
              represent and warrant that you are solely responsible for ensuring that your access and use of the Service
              does not violate any applicable laws in any country, territory or jurisdiction where the Service is being
              accessed.&nbsp;
            </span>
          </p>
          <p dir="ltr">
            <span>
              Your access and use of the Service may be interrupted from time to time for any of several reasons,
              including, without limitation, the malfunction of equipment, periodic updating, maintenance, or repair of
              the Service or other actions that Infinity, in its sole discretion, may elect to take.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Ownership</span>
          </p>
          <p dir="ltr">
            <span>
              Infinity owns the Service. You acknowledge and agree that Infinity (or, as applicable, our licensors) owns
              all legal right, title and interest in and to all other elements of the App, and all intellectual property
              rights therein (including, without limitation, all art, the Infinity ecosystem, all designs, systems,
              methods, information, computer code, software, services, website design, "look and feel", themes,
              organization, compilation of the content, code, data and database, functionality, audio, sound effects,
              video, animation, text, photograph, artwork, graphics, objects, characters, character&nbsp; names,
              stories, dialogue, and all other elements of the Service (collectively, the "
            </span>
            <span className="font-bold">Materials</span>
            <span>").&nbsp;</span>
          </p>
          <p dir="ltr">
            <span>
              You acknowledge that the Materials are protected by copyright, trade dress, patent, and trademark laws,
              international conventions, other relevant intellectual property and proprietary rights, and applicable
              laws. All Materials are the copyrighted property of Infinity or its licensors, and all trademarks, service
              marks, and trade names associated with the App or otherwise contained in the Materials are proprietary to
              Infinity or its licensors. Except as expressly set forth herein, your use of the Service does not grant
              you ownership of or any other rights with respect to any content, code, data, or other Materials that you
              may access on or through the Service. We reserve all rights in and to the Materials that are not expressly
              granted to you in these Terms. You will not apply for, register, or otherwise use or attempt to use any
              Infinity trademarks or service marks, or any confusingly similar marks, anywhere in the world without our
              prior written consent in each case, which consent we may withhold at our sole and absolute discretion.
            </span>
          </p>
          <p dir="ltr">
            <span>
              You may choose to submit comments, bug reports, ideas or other feedback about the Service, including
              without limitation about how to improve the Service (collectively, "
            </span>
            <span className="font-bold">Feedback</span>
            <span>
              "). By submitting any Feedback, you agree that we are free to use such Feedback at our discretion and
              without additional compensation to you, and to disclose such Feedback to third parties (whether on a
              non-confidential basis, or otherwise). You hereby grant us a perpetual, irrevocable, nonexclusive,
              worldwide license under all rights necessary for us to incorporate and use your Feedback for any purpose.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>License to Access</span>
          </p>
          <p dir="ltr">
            <span>
              You are hereby granted a limited, nonexclusive, nontransferable, nonsublicensable, and personal license to
              access and use the Service provided, however, that such license is subject to your compliance with these
              Terms. If any software, content, or other materials owned by, controlled by, or licensed to us are
              distributed or made available to you as part of your use of the Service, we hereby grant you a
              non-commercial, personal, non-assignable, non-sublicensable, non-transferrable, and non-exclusive right
              and license to access and display such software, content, and materials provided to you as part of the
              Service (and right to download a single copy of the App onto your applicable equipment or device), in each
              case for the sole purpose of enabling you to use the Service as permitted by these Terms, provided that
              your license in any content linked to or associated with any NFTs is solely as set forth by the applicable
              seller or creator of such NFT.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Third-Party Content and Services</span>
          </p>
          <p dir="ltr">
            <span>
              As a peer-to-peer blockchain service, Pixl helps you explore NFTs created by third parties and interact
              with different blockchains. Infinity does not make any representations or warranties about this
              third-party content visible through our Service, including any content associated with NFTs displayed on
              the Service, and you bear responsibility for verifying the legitimacy, authenticity, and legality of NFTs
              that you purchase from third-party sellers. We also cannot guarantee that any NFTs visible on Pixl will
              always remain visible and/or available to be bought, sold, or transferred.
            </span>
          </p>
          <p dir="ltr">
            <span>
              NFTs may be subject to terms directly between buyers and sellers with respect to the use of the NFT
              content and benefits associated with a given NFT (&ldquo;Purchase Terms&rdquo;). For example, when you
              click to get more details about any of the NFTs visible on Pixl, you may notice a third party link to the
              creator&rsquo;s website. Such website may include Purchase Terms governing the use of the NFT that you
              will be required to comply with. Infinity is not a party to any such Purchase Terms, which are solely
              between the buyer and the seller. The buyer and seller are entirely responsible for communicating,
              promulgating, agreeing to, and enforcing Purchase Terms. You are solely responsible for reviewing such
              Purchase Terms.
            </span>
          </p>
          <p dir="ltr">
            <span>
              The Service may also contain links or functionality to access or use third-party websites
              (&ldquo;Third-Party Websites&rdquo;) and applications (&ldquo;Third-Party Applications&rdquo;), or
              otherwise display, include, or make available content, data, information, services, applications, or
              materials from third parties (&ldquo;Third-Party Materials&rdquo;). When you click on a link to, or access
              and use, a Third-Party Website or Third-Party Application, though we may not warn you that you have left
              our Service, you are subject to the terms and conditions (including privacy policies) of another website
              or destination. Such Third-Party Websites, Third-Party Applications, and Third-Party Materials are not
              under the control of Infinity, and may be &ldquo;open&rdquo; applications for which no recourse is
              possible. Infinity is not responsible or liable for any Third-Party Websites, Third-Party Applications,
              and Third-Party Materials. Infinity provides links to these Third-Party Websites and Third-Party
              Applications only as a convenience and does not review, approve, monitor, endorse, warrant, or make any
              representations with respect to Third-Party Websites or Third-Party Applications, or their products or
              services or associated Third-Party Materials. You use all links in Third-Party Websites, Third-Party
              Applications, and Third-Party Materials at your own risk.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>User Terms</span>
          </p>
          <p dir="ltr">
            <span>
              You agree that you are responsible for your own conduct while accessing or using the Service, and for any
              consequences thereof. You agree to use the Service only for purposes that are legal, proper and in
              accordance with these Terms and any applicable laws or regulations. By way of example, and not as a
              limitation, you may not, and may not allow any third party to: (i) send, upload, distribute or disseminate
              any unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable content;
              (ii) distribute viruses, worms, defects, Trojan horses, corrupted files, hoaxes, or any other items of a
              destructive or deceptive nature; (iii) impersonate another person (via the use of an email address or
              otherwise); (iv) upload, post, transmit or otherwise make available through the Service any content that
              infringes the intellectual proprietary rights of any party; (v) use the Service to violate the legal
              rights (such as rights of privacy and publicity) of others; (vi) engage in, promote, or encourage illegal
              activity (including, without limitation, money laundering); (vii) interfere with other users' enjoyment of
              the Service; (viii) exploit the Service for any unauthorized commercial purpose, or facilitate, create or
              maintain any unauthorised connection to the Service; (ix) modify, adapt, translate, decompile, disassemble
              or reverse engineer any portion of the Service; (x) attempt to bypass any measure of the Service designed
              to prevent or restrict access to the Service, or any portion of the Service; (xi) harass, intimidate, or
              threaten any of our employees or agents engaged in providing any portion of the Service to you; (xii)
              remove any copyright, trademark or other proprietary rights notices contained in or on the Service or any
              part of it; (xi) reformat or frame any portion of the Service; (xiii) display any content on the Service
              that contains any hate-related or violent content or contains any other material, products or services
              that violate or encourage conduct that would violate any criminal laws, any other applicable laws, or any
              third party rights; (xiv) use any robot, spider, site search/retrieval application, or other device to
              retrieve or index any portion of the Service or the content posted on the Service, or to collect
              information about its users for any unauthorized purpose; (xv) circumvent any content-filtering
              techniques, security measures or access controls that Infinity employs on the Service, including without
              limitation usage of a VPN (xvi) upload or transmit (or attempt to upload or to transmit) any material that
              acts as a passive or active information collection or transmission mechanism, including without
              limitation, clear graphics interchange formats (&ldquo;gifs&rdquo;), 1&times;1 pixels, web bugs, cookies,
              or other similar devices (sometimes referred to as &ldquo;spyware&rdquo; or &ldquo;passive collection
              mechanisms&rdquo; or &ldquo;pcms&rdquo;); (xvii) create user accounts by automated means or under false or
              fraudulent pretences; (xviii) use the Service to advertise or offer to sell goods and services; or (xix)
              disparage, tarnish, or otherwise harm, in our opinion, us and/or the Service. If you engage in any of the
              activities prohibited by this Section, we may, at our sole and absolute discretion, without notice to you,
              and without limiting any of our other rights or remedies at law or in equity, immediately suspend or
              terminate your user account and/or delete your images and descriptions from the Service.
            </span>
          </p>
          <p dir="ltr">
            <span>
              By using the Service, you represent and warrant that: (i) you have read and understood these Terms and all
              documentation on the Service; (ii) you have good and sufficient experience and understanding of the
              functionality, usage, storage, transmission mechanisms and other material characteristics of cryptographic
              tokens, token storage mechanisms (such as token wallets), blockchain technology, blockchain-like
              technology and blockchain-based software systems to understand these Terms; (iii) you acknowledge and
              agree that we may impose eligibility criteria to access certain functionality which may require you to
              incur additional time and money costs; (iv) all registration information you submit will be true,
              accurate, current, and complete (if you provide any information that is untrue, inaccurate, not current,
              or incomplete, we have the right to suspend or terminate your account and refuse any and all current or
              future use of the Site or the App (or any portion thereof)); (v) you will maintain the accuracy of such
              information and promptly update such registration information as necessary; (vi) you have the legal
              capacity and you agree to comply with these Terms; (vii) you are not a minor in the jurisdiction in which
              you reside; (viii) you will not use the Service for any illegal, immoral or unauthorized purpose; (ix) you
              will not use the Service for any other purpose (save as approved by Infinity in writing); (x) your use of
              the Service will not violate any applicable law or regulation; (xi) any funds or digital assets used
              within Infinity are not derived from or related to any unlawful activities, including but not limited to
              money laundering or terrorist financing and all applicable statutes of all jurisdictions in which you are
              located, resident, organised or operating, and/or to which it may otherwise be subject and the rules and
              regulations thereunder (collectively, the "
            </span>
            <span className="font-bold">Compliance Regulations</span>
            <span>
              "), (xii) you will not use VPN software or any other privacy or anonymization tools or techniques to
              circumvent or attempt to circumvent any restrictions that apply to use or access of the Service or the
              services thereon, and (xiii) you will not use Pixl to finance, engage in, or otherwise support any
              unlawful activities or in a manner which aids or facilitates another party in the same. To the extent
              required by applicable laws and regulations, you shall fully comply with all Compliance Regulations.
            </span>
          </p>
          <p dir="ltr">
            <span>
              You may be required to register with the Service. We reserve the right to remove, reclaim or change a
              username you select if we determine, in our sole discretion, that such username is inappropriate, obscene,
              or otherwise objectionable.
            </span>
          </p>
          <p dir="ltr">
            <span>
              You acknowledge and agree that any questions, comments, suggestions, ideas, feedback or other information
              regarding the Service ("
            </span>
            <span className="font-bold">Submissions</span>
            <span>
              ") provided by you to us are non-confidential and should become our sole property. We should own exclusive
              rights, including all intellectual property rights, and should be entitled to the unrestricted use and
              dissemination of these Submissions to any lawful purpose, commercial, or otherwise, without acknowledgment
              or compensation for you. You hereby waive any moral rights to any such Submissions, and you hereby warrant
              that any such Submissions are original with you or that you have the right to submit such Submissions. You
              agree there should be no recourse against us for any alleged or actual infringement or misappropriation of
              any proprietary right in your Submissions.
            </span>
          </p>
          <p dir="ltr">
            <span>
              We reserve the right to conduct "Know Your Customer" and "Anti-Money Laundering" checks on you if deemed
              necessary by us (at our sole discretion) or such checks become required under applicable laws in any
              jurisdiction. Upon our request, you shall immediately provide us with information and documents that we,
              in our sole discretion, deem necessary or appropriate to conduct "Know Your Customer" and "Anti-Money
              Laundering" checks. Such documents may include, but are not limited to, passports, driver's licenses,
              utility bills, photographs of associated individuals, government identification cards or sworn statements
              before notaries or other equivalent professionals. Notwithstanding anything herein, we may, in its sole
              discretion, refuse to provide access of the Service to you until such requested information is provided,
              or in the event that, based on information available to us, you are suspected of using the Service in
              connection with any money laundering, terrorism financing, or any other illegal activity. In addition, we
              shall be entitled to use any possible efforts for preventing money laundering, terrorism financing or any
              other illegal activity, including without limitation blocking of your access to the Service or providing
              your information to any regulatory authority.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Fees and Payment</span>
          </p>
          <p dir="ltr">
            <span>
              If you elect to interact within the Infinity ecosystem (whether with other users or otherwise), any
              financial transactions that you engage in will be conducted solely through the relevant Blockchain
              Network. We will have no insight into or control over these payments or transactions, nor do we have the
              ability to reverse any transactions. With that in mind, we will have no liability to you or to any third
              party for any claims or damages that may arise as a result of any transactions that you engage in via the
              Service, or any other transactions that you conduct via the relevant Blockchain Network.
            </span>
          </p>
          <p dir="ltr">
            <span>The relevant Blockchain Network requires the payment of a transaction fee (a "</span>
            <span className="font-bold">Gas Fee</span>
            <span>
              ") for every transaction that occurs on the relevant Blockchain Network. The Gas Fee funds the network of
              computers that run the decentralized network. This means that you will need to pay a Gas Fee for each
              transaction that occurs via the Service.
            </span>
          </p>
          <p dir="ltr">
            <span>
              In addition to the Gas Fee, each time you utilize Pixl to conduct a transaction with another user via the
              Service, you authorize us to collect a trading fee calculated based on the total value of that
              transaction, and as notified to you from time to time via the most updated fee schedule in the Service
              (the "
            </span>
            <span className="font-bold">Trading Fee</span>
            <span>
              "). For each transaction where a Trading Fee is payable, we shall give you the opportunity to view and
              accept the Trading Fee before confirming the transaction and paying the Trading Fee. You acknowledge and
              agree that the Trading Fee will be transferred directly to us through the relevant Blockchain Network as
              part of your payment.
            </span>
          </p>
          <p dir="ltr">
            <span>
              As between us, you will be solely responsible to pay any and all sales, use, value-added and other taxes,
              duties, and assessments (except taxes on our net income) now or hereafter claimed or imposed by any
              governmental authority (collectively, "
            </span>
            <span className="font-bold">Taxes</span>
            <span>
              ") associated with your use of the Service (including, without limitation, any Taxes that may become
              payable as the result of your ownership or transfer or interaction relating to Pixl). Except for income
              taxes levied on Infinity, you: (i) will pay or reimburse us for all national, federal, state, local or
              other taxes and assessments of any jurisdiction, including value added taxes and taxes as required by
              international tax treaties, customs or other import or export taxes, and amounts levied in lieu thereof
              based on charges set, services performed or payments made hereunder, as are now or hereafter may be
              imposed under the authority of any national, state, local or any other taxing jurisdiction; and (ii) shall
              not be entitled to deduct the amount of any such taxes, duties or assessments from payments made to us
              pursuant to these Terms. You confirm that you are not registered for Goods and Services tax or any similar
              sales tax in Singapore, and will inform Infinity if your status changes in the future.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Termination</span>
          </p>
          <p dir="ltr">
            <span>
              You may terminate these Terms at any time by discontinuing your access to and use of the Service. You will
              not receive any refunds if you cancel your account, or otherwise terminate these Terms. You agree that we,
              in our sole discretion and for any or no reason, may terminate these Terms and suspend and/or terminate
              your account(s) for the Service. You agree that any suspension or termination of your access to the
              Service may be without prior notice, and that we will not be liable to you or to any third party for any
              such suspension or termination. If we terminate these Terms or suspend or terminate your access to or use
              of the Service due to your breach of these Terms or any suspected fraudulent, abusive, or illegal
              activity, then termination of these Terms will be in addition to any other remedies we may have at law or
              in equity. Upon any termination or expiration of these Terms, whether by you or us, you may no longer have
              access to information that you have posted on the Service or that is related to your account, and you
              acknowledge that we will have no obligation to maintain any such information in our databases or to
              forward any such information to you or to any third party.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Disclaimer</span>
          </p>
          <p dir="ltr">
            <span>
              YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR ACCESS TO AND USE OF THE SERVICE IS AT YOUR SOLE RISK, AND
              THAT THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
              IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, WE, OUR SUBSIDIARIES, AFFILIATES,
              AND LICENSORS MAKE NO EXPRESS WARRANTIES AND HEREBY DISCLAIM ALL IMPLIED WARRANTIES REGARDING THE APP AND
              ANY PART OF IT (INCLUDING, WITHOUT LIMITATION, THE SERVICE, ANY SMART CONTRACT, OR ANY EXTERNAL WEBSITES),
              INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
              CORRECTNESS, ACCURACY, OR RELIABILITY. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, WE, OUR
              SUBSIDIARIES, AFFILIATES, AND LICENSORS DO NOT REPRESENT OR WARRANT TO YOU THAT: (I) YOUR ACCESS TO OR USE
              OF THE SERVICE WILL MEET YOUR REQUIREMENTS, (II) YOUR ACCESS TO OR USE OF THE APP WILL BE UNINTERRUPTED,
              TIMELY, SECURE OR FREE FROM ERROR, (III) USAGE DATA PROVIDED THROUGH THE APP WILL BE ACCURATE, (IV) THE
              APP OR ANY CONTENT, SERVICES, OR FEATURES MADE AVAILABLE ON OR THROUGH THE APP ARE FREE OF VIRUSES OR
              OTHER HARMFUL COMPONENTS, OR (V) THAT ANY DATA THAT YOU DISCLOSE WHEN YOU USE THE APP WILL BE SECURE. SOME
              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES IN CONTRACTS WITH CONSUMERS, SO SOME OR ALL
              OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
            </span>
          </p>
          <p dir="ltr">
            <span>
              YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET, AND
              AGREE THAT WE HAVE NO LIABILITY OR RESPONSIBILITY FOR ANY BREACH OF SECURITY UNLESS IT IS DUE TO OUR
              WILFUL DEFAULT.
            </span>
          </p>
          <p dir="ltr">
            <span>
              WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSSES YOU INCUR AS THE RESULT OF YOUR USE OF THE
              RELEVANT BLOCKCHAIN NETWORK OR THE METAMASK ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO ANY LOSSES,
              DAMAGES OR CLAIMS ARISING FROM: (i) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR INCORRECTLY CONSTRUED SMART
              CONTRACTS OR OTHER TRANSACTIONS; (ii) SERVER FAILURE OR DATA LOSS; (iii) CORRUPTED WALLET FILES; OR (iv)
              UNAUTHORIZED ACCESS OR ACTIVITIES BY THIRD PARTIES, INCLUDING BUT NOT LIMITED TO THE USE OF VIRUSES,
              PHISHING, BRUTEFORCING OR OTHER MEANS OF ATTACK AGAINST THE APP, THE RELEVANT BLOCKCHAIN NETWORK, OR THE
              METAMASK ELECTRONIC WALLET.
            </span>
          </p>
          <p dir="ltr">
            <span>
              ALL SMART CONTRACTS IN CONNECTION WITH INFINITY ARE DEPLOYED ON AND INTERACTIONS/TRANSACTIONS WITH THE
              SAME OCCUR ON THE DECENTRALIZED LEDGER WITHIN THE RELEVANT BLOCKCHAIN NETWORK. WE HAVE NO CONTROL OVER AND
              MAKE NO GUARANTEES OR PROMISES WITH RESPECT TO SMART CONTRACTS.
            </span>
          </p>
          <p dir="ltr">
            <span>
              INFINITY IS NOT RESPONSIBLE FOR LOSSES DUE TO BLOCKCHAINS OR ANY OTHER FEATURES OF THE RELEVANT BLOCKCHAIN
              NETWORK OR THE METAMASK ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO LATE REPORT BY DEVELOPERS OR
              REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE BLOCKCHAIN SUPPORTING THE RELEVANT BLOCKCHAIN
              NETWORK, INCLUDING FORKS, TECHNICAL NODE ISSUES, OR ANY OTHER ISSUES HAVING FUND LOSSES AS A RESULT.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Limitation of Liability</span>
          </p>
          <p dir="ltr">
            <span>
              YOU UNDERSTAND AND AGREE THAT WE, OUR SUBSIDIARIES, AFFILIATES, AND LICENSORS WILL NOT BE LIABLE TO YOU OR
              TO ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES WHICH YOU
              MAY INCUR, HOWSOEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, INCLUDING, WITHOUT LIMITATION, ANY LOSS OF
              PROFITS (WHETHER INCURRED DIRECTLY OR INDIRECTLY), LOSS OF GOODWILL OR BUSINESS REPUTATION, LOSS OF DATA,
              COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, OR ANY OTHER INTANGIBLE LOSS, EVEN IF WE HAVE BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </span>
          </p>
          <p dir="ltr">
            <span>
              YOU AGREE THAT OUR TOTAL, AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATING TO
              THESE TERMS OR YOUR ACCESS TO OR USE OF (OR YOUR INABILITY TO ACCESS OR USE) ANY PORTION OF THE APP,
              WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, IS LIMITED TO THE GREATER OF (A)
              THE AMOUNTS YOU ACTUALLY PAID US UNDER THESE TERMS IN THE 12 MONTH PERIOD PRECEDING THE DATE THE CLAIM
              AROSE, OR (B) S$100.
            </span>
          </p>
          <p dir="ltr">
            <span>
              YOU ACKNOWLEDGE AND AGREE THAT WE HAVE MADE THE APP AVAILABLE TO YOU AND ENTERED INTO THESE TERMS IN
              RELIANCE UPON THE WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY SET FORTH HEREIN, WHICH REFLECT A
              REASONABLE AND FAIR ALLOCATION OF RISK BETWEEN THE PARTIES AND FORM AN ESSENTIAL BASIS OF THE BARGAIN
              BETWEEN US. WE WOULD NOT BE ABLE TO PROVIDE THE APP TO YOU WITHOUT THESE LIMITATIONS.
            </span>
          </p>
          <p dir="ltr">
            <span>
              D. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, AND
              SOME JURISDICTIONS ALSO LIMIT DISCLAIMERS OR LIMITATIONS OF LIABILITY FOR PERSONAL INJURY FROM CONSUMER
              PRODUCTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO PERSONAL INJURY CLAIMS.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Assumption of Risk</span>
          </p>
          <p dir="ltr">
            <span>You accept and acknowledge each of the following:</span>
          </p>
          <p dir="ltr">
            <span>
              You are solely responsible for determining what, if any, taxes apply to your NFT-related transactions.
              Infinity is not responsible for determining the taxes that apply to your transactions on the Service.
            </span>
          </p>
          <p dir="ltr">
            <span>
              The Service does not store, send, or receive NFTs. This is because NFTs exist only by virtue of the
              ownership record maintained on the Services supporting blockchain in the relevant Blockchain Network. Any
              transfer of NFTs occurs within the supporting blockchain in the relevant Blockchain Network, and not on
              the Services.
            </span>
          </p>
          <p dir="ltr">
            <span>
              The publicly deployed Smart Contracts you interact with may contain security vulnerabilities,
              errors,&nbsp; failures, bugs or economic loopholes which may be exploited by third parties. Interaction
              with these Smart Contracts are entirely your own responsibility and liability, and Infinity is not a party
              to the Smart Contracts.
            </span>
          </p>
          <p dir="ltr">
            <span>
              There are risks associated with using an Internet-based currency, including, but not limited to, the risk
              of hardware, software and Internet connections, the risk of malicious software introduction, and the risk
              that third parties may obtain unauthorized access to information stored within your wallet. You accept and
              acknowledge that Infinity will not be responsible for any communication failures, disruptions, errors,
              distortions or delays you may experience when using the relevant Blockchain Network, however caused.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Because Pixl is based on blockchain technology, any malfunction, breakdown or abandonment of the relevant
              Blockchain Network may have a material adverse effects. Moreover, advances in cryptography, or technical
              advances such as the development of quantum computing, could present risks to Infinity, the underlying
              digital assets, or the relevant Blockchain Network by rendering ineffective the cryptographic consensus
              mechanism that underpins the relevant Blockchain Network. The future of cryptography and security
              innovations are highly unpredictable.
            </span>
          </p>
          <p dir="ltr">
            <span>
              A private key, or a combination of private keys, is necessary to control and dispose of NFTs stored in
              your digital wallet, vault or other storage mechanism. Accordingly, loss of requisite private key(s)
              associated with such digital wallet, vault or other storage mechanism storing NFTs may result in loss of
              such NFTs. Moreover, any third party that gains access to such private key(s), including by gaining access
              to login credentials of a hosted wallet service which you use, may be able to misappropriate any NFTs held
              by you. Infinity cannot be responsible for any such losses.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Hackers or other malicious groups or organisations may attempt to interfere with NFTs or the Service in a
              variety of ways, including, but not limited to, malware attacks, denial of service attacks,
              consensus-based attacks, Sybil attacks, smurfing and spoofing, which may result in losses incurred by you.
            </span>
          </p>
          <p dir="ltr">
            <span>
              A lack of use or public interest in the creation and development of distributed ecosystems could
              negatively impact the development of the Infinity ecosystem, and therefore the potential utility or value
              of Infinity.
            </span>
          </p>
          <p dir="ltr">
            <span>
              The regulatory regime governing blockchain technologies, cryptocurrencies, and tokens is uncertain, and
              new regulations or policies may materially adversely affect the development of the Infinity ecosystem, and
              therefore the potential utility or value of Infinity.
            </span>
          </p>
          <p dir="ltr">
            <span>
              An upgrade, hard fork, or a change in how transactions are confirmed on the relevant Blockchain Network
              may have unintended, adverse effects on all blockchains using the ERC-20, ERC-721, or ERC-1155 standard,
              including the Infinity ecosystem.
            </span>
          </p>
          <p dir="ltr">
            <span>
              Cryptographic tokens such as ${FLOW_TOKEN.symbol} are a new and untested technology. In addition to the
              aforementioned risks, there may be other risks associated with your creation, holding and use of $
              {FLOW_TOKEN.symbol}, including those that Infinity cannot anticipate. Such risks may further materialise
              as unanticipated variations or combinations of the risks discussed herein.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Indemnification</span>
          </p>
          <p dir="ltr">
            <span>
              You agree to hold harmless and indemnify Infinity and its subsidiaries, affiliates, officers, agents,
              employees, advertisers, licensors, suppliers or partners from and against any claim, liability, loss,
              damage (actual and consequential) of any kind or nature, suit, judgment, litigation cost, and attorneys'
              fees arising out of or in any way related to (i) your breach of these Terms, (ii) your misuse of the App,
              or (iii) your violation of applicable laws, rules or regulations in connection with your access to or use
              of the App. You agree that Infinity will have control of the defence or settlement of any such claims.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>External Sites</span>
          </p>
          <p dir="ltr">
            <span>The Service may include hyperlinks to other web sites or resources (collectively, "</span>
            <span>External Sites</span>
            <span>
              "), which are provided solely as a convenience to our users. We have no control over any External Sites.
              You acknowledge and agree that we are not responsible for the availability of any External Sites, and that
              we do not endorse any advertising, products or other materials on or made available from any External
              Sites. Furthermore, you acknowledge and agree that we are not liable for any loss or damage which may be
              incurred as a result of the availability or unavailability of the External Sites, or as a result of any
              reliance placed by you upon the completeness, accuracy or existence of any advertising, products or other
              materials on, or made available from, any External Sites.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Changes to the App</span>
          </p>
          <p dir="ltr">
            <span>
              We are constantly innovating the App to help provide the best possible experience. You acknowledge and
              agree that the form and nature of the App, and any part of it, may change from time to time without prior
              notice to you, and that we may add new features and change any part of the App at any time without notice.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Privacy Policy and User Data</span>
          </p>
          <p dir="ltr">
            <span>
              Our&nbsp;Privacy Policy&nbsp;(available at [link]) describes the ways we collect, use, store and disclose
              your personal information, and is hereby incorporated by this reference into these Terms. You agree to the
              collection, use, storage, and disclosure of your data in accordance with the aforementioned&nbsp;Privacy
              Policy.
            </span>
          </p>
          <p dir="ltr">
            <span>
              We will maintain certain data that you transmit to the Service for the purpose of managing the performance
              of the Service, as well as data relating to your use of the Service. Although we perform regular routine
              backups of data, you are solely responsible for all data that you transmit or that release to any activity
              you have undertaken using the Service. You agree that we shall have no liability to you for any loss or
              corruption of any such data, and you hereby waive any right of action against us arising from any such
              loss or corruption of such data.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>Dispute Resolution; Arbitration</span>
          </p>
          <p dir="ltr">
            <span>
              Please read this Section carefully. It requires you to arbitrate disputes with Infinity, and limits the
              manner in which you can seek relief from us.
            </span>
          </p>
          <p dir="ltr">
            <span>
              All disputes arising out of or in connection with these Terms (including without limitation the
              enforceability of this Section 13 or any question regarding its existence, validity or termination, your
              access or use of the Service, or to any products sold or distributed through the Service) shall be
              referred to and finally resolved by arbitration administered by the Singapore International Arbitration
              Centre ("
            </span>
            <span className="font-bold">SIAC</span>
            <span>
              ") in accordance with the Arbitration Rules of the Singapore International Arbitration Centre ("
            </span>
            <span className="font-bold">SIAC Rules</span>
            <span>
              ") for the time being in force, which rules are deemed to be incorporated by reference in this Section 13.
              The seat of the arbitration shall be Singapore. The Tribunal shall consist of 1 arbitrator. The language
              of the arbitration shall be English. The award of the arbitrator will be final and binding, and any
              judgment on the award rendered by the arbitrator may be entered in any court of competent jurisdiction.
              Each party will cover its own fees and costs associated with the arbitration proceedings. Notwithstanding
              the foregoing, Infinity may seek and obtain injunctive relief in any jurisdiction in any court of
              competent jurisdiction, and you agree that these Terms are specifically enforceable by Infinity through
              injunctive relief and other equitable remedies without proof of monetary damages.
            </span>
          </p>
          <p dir="ltr">
            <span>
              WITH RESPECT TO ANY DISPUTE ARISING OUT OF OR RELATED TO THESE TERMS, INCLUDING WITHOUT LIMITATION
              DISPUTES RELATED TO THE SERVICE ANY PRODUCTS SOLD OR DISTRIBUTED THROUGH THE SERVICE: (I) YOU HEREBY
              EXPRESSLY GIVE UP YOUR RIGHT TO HAVE A TRIAL BY JURY; AND (II) YOU HEREBY EXPRESSLY GIVE UP YOUR RIGHT TO
              PARTICIPATE AS A MEMBER OF A CLASS OF CLAIMANTS IN ANY LAWSUIT, INCLUDING BUT NOT LIMITED TO CLASS ACTION
              LAWSUITS INVOLVING ANY SUCH DISPUTE.
            </span>
          </p>
          <p dir="ltr" className="font-bold">
            <span>General</span>
          </p>
          <p dir="ltr">
            <span>
              These Terms constitute the entire legal agreement between you and Infinity, govern your access to and use
              of the Service, and completely replace any prior or contemporaneous agreements between the parties related
              to your access to or use of the Service, whether oral or written.
            </span>
          </p>
          <p dir="ltr">
            <span>
              There are no third party beneficiaries to these Terms. A person who is not a party under these Terms has
              no right under the Contracts (Rights of Third Parties) Act, Chapter 53B of Singapore to enforce or to
              enjoy the benefit of these Terms.
            </span>
          </p>
          <p>
            <span>&nbsp;</span>
          </p>
        </div>
        <div></div>
      </div>
    </APageBox>
  );
};

export default TermsPage;

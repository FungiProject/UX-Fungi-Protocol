import Button from "../../common/Buttons/Button";
import { useAffiliateCodes } from "../../../../utils/gmx/domain/referrals/hooks";
import { Token } from "../../../../utils/gmx/domain/tokens";
import { BigNumber } from "ethers";
import { toJpeg } from "html-to-image";
import shareBgImg from "../../../../img/position-share-bg.png";
import downloadImage from "../../../../utils/gmx/lib/dowloadImage";
import {
  getRootShareApiUrl,
  getTwitterIntentURL,
} from "../../../../utils/gmx/lib/legacy";
import useLoadImage from "../../../../utils/gmx/lib/useLoadImage";
import { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { FiTwitter } from "react-icons/fi";
import { RiFileDownloadLine } from "react-icons/ri";
import { useCopyToClipboard } from "react-use";
import Modal from "../../common/Modal/Modal";
import { PositionShareCard } from "./PositionShareCard";
import { useNotification } from "@/context/NotificationContextProvider";

const ROOT_SHARE_URL = getRootShareApiUrl();
const UPLOAD_URL = ROOT_SHARE_URL + "/api/upload";
const UPLOAD_SHARE = ROOT_SHARE_URL + "/api/s";
const config = {
  quality: 0.95,
  canvasWidth: 518,
  canvasHeight: 292,
  type: "image/jpeg",
};

function getShareURL(imageInfo, ref) {
  if (!imageInfo) return;
  let url = `${UPLOAD_SHARE}?id=${imageInfo.id}`;
  if (ref.success && ref.code) {
    url = url + `&ref=${ref.code}`;
  }
  return url;
}

type Props = {
  entryPrice: BigNumber | undefined;
  indexToken: Token;
  isLong: boolean;
  leverage: BigNumber | undefined;
  markPrice: BigNumber;
  pnlAfterFeesPercentage: BigNumber;
  setIsPositionShareModalOpen: (isOpen: boolean) => void;
  isPositionShareModalOpen: boolean;
  account: string | undefined | null;
  chainId: number;
};

function PositionShare({
  entryPrice,
  indexToken,
  isLong,
  leverage,
  markPrice,
  pnlAfterFeesPercentage,
  setIsPositionShareModalOpen,
  isPositionShareModalOpen,
  account,
  chainId,
}: Props) {
  const { showNotification } = useNotification();
  const userAffiliateCode = useAffiliateCodes(chainId, account);
  const [uploadedImageInfo, setUploadedImageInfo] = useState<any>();
  const [uploadedImageError, setUploadedImageError] = useState<string | null>(
    null
  );
  const [, copyToClipboard] = useCopyToClipboard();
  const sharePositionBgImg = useLoadImage(shareBgImg as any);
  const cardRef = useRef<HTMLDivElement>(null);
  const tweetLink = getTwitterIntentURL(
    `Latest $${indexToken?.symbol} trade on @GMX_IO`,
    getShareURL(uploadedImageInfo, userAffiliateCode)
  );

  useEffect(() => {
    (async function () {
      const element = cardRef.current;
      if (element && userAffiliateCode.success && sharePositionBgImg) {
        // We have to call the toJpeg function multiple times to make sure the canvas renders all the elements like background image
        // @refer https://github.com/tsayen/dom-to-image/issues/343#issuecomment-652831863
        const image = await toJpeg(element, config)
          .then(() => toJpeg(element, config))
          .then(() => toJpeg(element, config));
        try {
          const imageInfo = await fetch(UPLOAD_URL, {
            method: "POST",
            body: image,
          }).then((res) => res.json());
          setUploadedImageInfo(imageInfo);
        } catch {
          setUploadedImageInfo(null);
          setUploadedImageError(
            `Image generation error, please refresh and try again.`
          );
        }
      }
    })();
  }, [userAffiliateCode, sharePositionBgImg, cardRef]);

  async function handleDownload() {
    const element = cardRef.current;
    if (!element) return;
    const imgBlob = await toJpeg(element, config)
      .then(() => toJpeg(element, config))
      .then(() => toJpeg(element, config));
    downloadImage(imgBlob, "share.jpeg");
  }

  function handleCopy() {
    if (!uploadedImageInfo) return;
    const url = getShareURL(uploadedImageInfo, userAffiliateCode);
    copyToClipboard(url as string);
    showNotification({
      message: "Link copied to clipboard.",
      type: "error",
    });
  }

  return (
    <Modal
      className="position-share-modal"
      isVisible={isPositionShareModalOpen}
      setIsVisible={setIsPositionShareModalOpen}
      label={`Share Position`}
    >
      <PositionShareCard
        entryPrice={entryPrice}
        indexToken={indexToken}
        isLong={isLong}
        leverage={leverage}
        markPrice={markPrice}
        pnlAfterFeesPercentage={pnlAfterFeesPercentage}
        userAffiliateCode={userAffiliateCode}
        ref={cardRef}
        loading={!uploadedImageInfo && !uploadedImageError}
        sharePositionBgImg={sharePositionBgImg}
      />
      {uploadedImageError && (
        <span className="error">{uploadedImageError}</span>
      )}

      <div className="actions">
        <Button
          variant="secondary"
          disabled={!uploadedImageInfo}
          className="mr-md"
          onClick={handleCopy}
        >
          <BiCopy className="icon" />
          <span>Copy</span>
        </Button>
        <Button
          variant="secondary"
          disabled={!uploadedImageInfo}
          className="mr-md"
          onClick={handleDownload}
        >
          <RiFileDownloadLine className="icon" />
          <span>Download</span>
        </Button>
        <Button
          newTab
          variant="secondary"
          disabled={!uploadedImageInfo}
          className="mr-md"
          to={tweetLink}
        >
          <FiTwitter className="icon" />
          <span>Tweet</span>
        </Button>
      </div>
    </Modal>
  );
}

export default PositionShare;

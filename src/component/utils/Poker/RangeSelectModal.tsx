import HandTable from "@/component/HandTable";
import { PorkerHands, YokosawaHandRangeTier } from "@/const/const_poker";
import { modalStyle, styleRangeSelectModal } from "@/const/theme/theme";
import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";

interface RangeSelectModalProps {
    onClose?: any
    open?: boolean
    tierRange?: YokosawaHandRangeTier[]
}

export const RangeSelectModal = (prop: RangeSelectModalProps) => {
    const [tierRange, setTierRange] = useState([YokosawaHandRangeTier.TIER_6, YokosawaHandRangeTier.TIER_1]);
    const [expanded, setExpanded] = useState(false);
    const [flagList, setFlagList] = useState<Map<string, boolean>>();
    useEffect(() => {
        if (prop.open != undefined) {
            setExpanded(prop.open);
        }
    }, [prop.open]);
    useEffect(() => {
        // console.log('HandTable useEffect prop.tierRange', prop.tierRange, flagList);
        // Tierのプルダウンが変更された時に結果一覧を無理やり更新するために追加（HandTableの中での更新はModalが開いて表示されないと行われないため）
        const tierR = prop.tierRange;
        if (prop.tierRange != undefined && tierR != undefined) {
            setFlagList(undefined);
            var fs = new Map<string, boolean>();
            for (let i = 0; i < PorkerHands.length; i++) {
                const element = PorkerHands[i];
                for (let j = 0; j < element.length; j++) {
                    const card = element[j];
                    const cTier = card.YokosawaTier;
                    if (cTier <= tierR[0] && cTier >= tierR[1]) {
                        fs.set(card.HandStr, true);
                    } else {
                        fs.set(card.HandStr, false);
                    }
                }
            }
            // console.log('HandTable useEffect prop.tierRange', fs, prop.onClose);
            setFlagList(fs);
            if (prop.onClose) {
                prop.onClose(fs);
            }
        }
    }, [prop.tierRange]);
    function handleClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void {
        // event
        // setExpanded(false);
        // console.log('RangeSelectModal handleClose', flagList);
        if (prop.onClose) {
            prop.onClose(flagList);
        }
    }
    function onRangeChange(event: any): void {
        // console.log('RangeSelectModal onRangeChange', event);
        setFlagList(event);
    }

    return (
        <Modal
            open={expanded}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleRangeSelectModal}>
                <div>
                    <HandTable tierRange={tierRange} mode="toggle" onRangeChange={onRangeChange} flags={flagList} />
                </div>
            </Box>
        </Modal>

    );
}
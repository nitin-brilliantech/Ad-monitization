import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReusableAccordion = ({
  items = [],
  sx = {},
  expandAll = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box sx={{ width: "100%", ...sx.container  }}>
      {items.map((item) => (
        <Accordion
          key={item.id}
          expanded={expandAll || expandedId === item.id}
          onChange={() => handleExpand(item.id)}
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: sx.accordion?.borderRadius || 2,
            border: "1px solid #e0e0e0",
            overflow: "hidden",
            "&:before": { display: "none" },
            "&:first-of-type": {
              borderRadius: sx.accordion?.borderRadius || 2,
            },
            "&:last-of-type": {
              borderRadius: sx.accordion?.borderRadius || 2,
            },
            "&:hover": {
              bgcolor: "#DBEAFE",
              borderColor: "#93C5FD",
            },
            ...sx.accordion,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              pr: 3,
              pl: 3,
              bgcolor: expandedId === item.id ? "#EFF6FF" : "transparent",
              borderRadius: "inherit",
              "& .MuiAccordionSummary-expandIconWrapper": {
                mr: 1.5,
              },
              ...sx.summary,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {item.question}
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails 
            sx={{ 
              px: 3,
              py: 2,
              bgcolor: "#fafafa",
              borderRadius: "inherit",
              ...sx.details 
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <Typography 
              sx={{ pl: 0 }}
              variant="body2" 
              color="text.secondary"
            >
              {item.solution}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ReusableAccordion;
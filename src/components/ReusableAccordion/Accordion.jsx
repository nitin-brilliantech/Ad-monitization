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
    <Box sx={{ width: "100%", ...sx.container }}>
      {items.map((item) => (
        <Accordion
          key={item.id}
          expanded={expandAll || expandedId === item.id}
          onChange={() => handleExpand(item.id)}
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            "&:before": { display: "none" },
            ...sx.accordion,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
                paddingRight:"10px",
              bgcolor: expandedId === item.id ? "#f5f5f5" : "transparent",
              "&:hover": { bgcolor: "#f5f5f5" },
              ...sx.summary,
            }}
          >
            <Box sx={{ paddingLeft: "15px", display: "flex", alignItems: "center", width: "auto" }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {item.question}
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails 
            sx={{ 
              bgcolor: "#fafafa", 
              ...sx.details 
            }}
          >


            <Divider sx={{ mb: 1, 
            paddingRight:"10px"
            }} />


            <Typography 
            sx={{ 
              paddingLeft: "15px",
            }}
            variant="body2" color="text.secondary">
              {item.solution}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ReusableAccordion;
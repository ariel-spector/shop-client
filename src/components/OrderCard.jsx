import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  Avatar,
  Box,
  Stack,
  Divider
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const OrderCard = ({ order }) => {

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CLOSED':
        return 'success';
      case 'TEMP':
        return 'info';
      default:
        return 'default';
    }
  };

  const isTemp = order.status === 'TEMP';

  return (

    <Accordion
      sx={{
        borderRadius: '16px !important',
        overflow: 'hidden',
        boxShadow: 2,
        borderLeft: isTemp ? '8px solid #ff4081' : 'none',
        bgcolor: isTemp ? 'rgba(255, 64, 129, 0.05)' : '#fff'
      }}
    >

      <AccordionSummary expandIcon={<ExpandMoreIcon />}>

        <Grid container spacing={2} sx={{ width: '100%' }}>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">
              {isTemp ? "Active Cart" : "Date"}
            </Typography>

            <Typography fontWeight="bold">
              {isTemp
                ? `Cart #${order.order_id}`
                : new Date(order.order_placed).toLocaleDateString()}
            </Typography>
          </Grid>


          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Total</Typography>

            <Typography fontWeight="bold" color="primary">
              ${order.total_price.toFixed(2)}
            </Typography>
          </Grid>


          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Status</Typography>

            <Chip
              label={isTemp ? "ACTIVE" : order.status}
              color={getStatusColor(order.status)}
              size="small"
            />
          </Grid>

        </Grid>

      </AccordionSummary>



      <AccordionDetails>

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Items
        </Typography>


        <Stack spacing={2}>

          {order.items?.map(item => (

            <Box
              key={item.item_id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >

              <Box sx={{ display: 'flex', gap: 2 }}>

                <Avatar
                  src={item.photo_url}
                  variant="rounded"
                >
                  {!item.photo_url && <ShoppingBagIcon />}
                </Avatar>


                <Box>

                  <Typography fontWeight="bold">
                    {item.item_name}
                  </Typography>

                  <Typography variant="caption">

                    ${item.price} x {item.quantity}

                  </Typography>

                </Box>

              </Box>


              <Typography fontWeight="bold">

                ${(item.price * item.quantity).toFixed(2)}

              </Typography>

            </Box>

          ))}

        </Stack>


        <Divider sx={{ my: 2 }} />


        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>

          <Typography variant="caption">

            <LocalShippingIcon fontSize="small" />

            {" "}
            {order.shipping_address}

          </Typography>


          <Typography fontWeight="bold">

            ${order.total_price.toFixed(2)}

          </Typography>

        </Box>

      </AccordionDetails>

    </Accordion>

  );

};

export default OrderCard;
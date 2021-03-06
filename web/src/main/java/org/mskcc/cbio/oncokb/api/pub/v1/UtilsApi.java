package org.mskcc.cbio.oncokb.api.pub.v1;

import io.swagger.annotations.*;
import org.mskcc.cbio.oncokb.apiModels.ActionableGene;
import org.mskcc.cbio.oncokb.apiModels.AnnotatedVariant;
import org.mskcc.cbio.oncokb.apiModels.CuratedGene;
import org.mskcc.cbio.oncokb.config.annotation.PremiumPublicApi;
import org.mskcc.cbio.oncokb.config.annotation.PublicApi;
import org.mskcc.cbio.oncokb.model.CancerGene;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created by Hongxin on 10/28/16.
 */

// It was tags=Utils. But temporally name it Cancer Genes so the Utils tag would not show up with empty content
@Api(tags = "Cancer Genes", description = "Cancer Genes")
public interface UtilsApi {
    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get All Annotated Variants.", response = AnnotatedVariant.class, responseContainer = "List", tags = {"Variants"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK", response = AnnotatedVariant.class, responseContainer = "List"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allAnnotatedVariants", produces = {"application/json"},
        method = RequestMethod.GET)
    ResponseEntity<List<AnnotatedVariant>> utilsAllAnnotatedVariantsGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get All Annotated Variants in text file.", tags = {"Variants"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allAnnotatedVariants.txt",
        produces = {"text/plain"},
        method = RequestMethod.GET)
    ResponseEntity<String> utilsAllAnnotatedVariantsTxtGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get All Actionable Variants.", response = ActionableGene.class, responseContainer = "List", tags = {"Variants"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK", response = ActionableGene.class, responseContainer = "List"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allActionableVariants", produces = {"application/json"},
        method = RequestMethod.GET)
    ResponseEntity<List<ActionableGene>> utilsAllActionableVariantsGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );


    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get All Actionable Variants in text file.", tags = {"Variants"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allActionableVariants.txt",
        produces = {"text/plain"},
        method = RequestMethod.GET)
    ResponseEntity<String> utilsAllActionableVariantsTxtGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PublicApi
    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get cancer gene list", tags = {"Cancer Genes"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/cancerGeneList",
        produces = {"application/json"},
        method = RequestMethod.GET)
    ResponseEntity<List<CancerGene>> utilsCancerGeneListGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PublicApi
    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get cancer gene list in text file.", tags = {"Cancer Genes"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/cancerGeneList.txt",
        produces = {"text/plain"},
        method = RequestMethod.GET)
    ResponseEntity<String> utilsCancerGeneListTxtGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get list of genes OncoKB curated", tags = {"Genes"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allCuratedGenes",
        produces = {"application/json"},
        method = RequestMethod.GET)
    ResponseEntity<List<CuratedGene>> utilsAllCuratedGenesGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );

    @PremiumPublicApi
    @ApiOperation(value = "", notes = "Get list of genes OncoKB curated in text file.", tags = {"Genes"})
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "OK"),
        @ApiResponse(code = 404, message = "Not Found"),
        @ApiResponse(code = 503, message = "Service Unavailable")
    })
    @RequestMapping(value = "/utils/allCuratedGenes.txt",
        produces = {"text/plain"},
        method = RequestMethod.GET)
    ResponseEntity<String> utilsAllCuratedGenesTxtGet(
        @ApiParam(value = "version") @RequestParam(value = "version", required = false) String version
    );
}

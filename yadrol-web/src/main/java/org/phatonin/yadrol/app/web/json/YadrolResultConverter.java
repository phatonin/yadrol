/**
   Copyright 2016-2017, Robert Bossy

   This file is part of Yadrol.

   Yadrol is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Yadrol is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Yadrol.  If not, see <http://www.gnu.org/licenses/>.
**/

package org.phatonin.yadrol.app.web.json;

import org.json.simple.JSONObject;
import org.phatonin.yadrol.app.YadrolResult;
import org.phatonin.yadrol.app.web.WebOptions;
import org.phatonin.yadrol.core.EvaluationContext;

public enum YadrolResultConverter implements JsonConverter<YadrolResult> {
	INSTANCE;

	@SuppressWarnings("unchecked")
	@Override
	public Object convert(YadrolResult value, WebOptions options) {
		JSONObject result = new JSONObject();
		result.put("expressions", ConverterUtil.convert(value.getExpressions(), ExpressionConverter.INSTANCE, options));
		EvaluationContext ctx = value.getEvaluationContext();
		result.put("dice-records", ConverterUtil.convert(ctx.getDiceRecords(), DiceRecordConverter.INSTANCE, options));
		result.put("global-scope", ConverterUtil.convert(ctx.getGlobalScope().getVariables(), ValueConverter.INSTANCE, options));
		result.put("roll-records", ConverterUtil.convert(ctx.getRollRecords(), RollRecordConverter.INSTANCE, options));
		result.put("sample-records", ConverterUtil.convert(ctx.getSampleRecords(), new SampleRecordConverter(ctx), options));
//		result.put("multi-counts", ConverterUtil.convert(ctx.getMultiCounts(options.getCountSelector().getRelative()), new MultiCountConverter(ctx), options));
		return result;
	}
}
